import type { TechDive } from "./types";

/** Nursie (ConUHacks X, Jan. 2026). Every number comes from the project repository, its git log and the portfolio pages. */
const D = "/media/nursie/deep";

const dive: TechDive = {
  heading: "How Nursie was built in 17 hours",
  intro:
    "Nursie watches a long-term care room with a TI mmWave radar, a floor vibration sensor, a PIR sensor and an Apple Watch. Two ESP32 boards publish to ROS 2 over Wi-Fi, a Flask backend runs the fall logic and a React dashboard shows the alert. The git log has 38 commits between 11:27 on Jan. 24 and 04:03 on Jan. 25, 2026.",
  architecture: {
    flow:
      "The radar streams tracked people over UART to the backend, which runs the two-stage fall detector and scores its confidence. Vibration and PIR readings go from their ESP32 boards to ROS 2 over Wi-Fi, then to the dashboard over a WebSocket. Every event goes through one Flask EventProcessor. Falls start an ElevenLabs voice check. No answer or a distress phrase escalates to a Twilio call to the nurse.",
    layers: [
      {
        name: "Sensors",
        blocks: [
          { name: "mmWave radar", role: "Tracks each person's position, height and speed with no camera.", tech: "TI IWR6843ISK-ODS, 55 ms frames" },
          { name: "Floor vibration", role: "Digital pulse on GPIO4, measured in µs.", tech: "ESP32 #1" },
          { name: "PIR motion", role: "Reads 0 or 1 every 50 ms.", tech: "ESP32 #2" },
          { name: "Door", role: "Night exit alerts. Simulated in the demo.", tech: "Mock mode, POST /door/simulate" },
          { name: "Apple Watch app", role: "Sends heart rate and accelerometer data every 1 s.", tech: "WatchApp, Swift" },
        ],
      },
      {
        name: "Edge",
        blocks: [
          { name: "ESP32 nodes", role: "A sensor task fills a one-slot queue. A micro-ROS task publishes the newest value.", tech: "ESP-IDF, FreeRTOS, micro-ROS" },
          { name: "micro-ROS agent", role: "Bridges both boards into ROS 2 over Wi-Fi.", tech: "UDP port 8888" },
        ],
      },
      {
        name: "Backend",
        blocks: [
          { name: "mmWave UART service", role: "Sends the chirp config, decodes TLV frames, runs the fall detector with confidence scoring.", tech: "Python, 115200 and 921600 baud" },
          { name: "ROS 2 bridge", role: "Subscribes to /vibration and /mouvement and rebroadcasts them as JSON.", tech: "rclpy, WebSocket 8765" },
          { name: "Flask EventProcessor", role: "Fixed rules for falls, voice and door events. Other events go to Gemini triage.", tech: "Flask" },
          { name: "MongoDB", role: "Stores alerts with their state history, events, devices and passive signals.", tech: "4 collections" },
        ],
      },
      {
        name: "Services",
        blocks: [
          { name: "Gemini", role: "Returns priority, an alert flag and an action line for events without a rule.", tech: "MEDIUM and alert on any error" },
          { name: "ElevenLabs agent", role: "Asks the resident if they are okay after a fall.", tech: "Verbal check webhook" },
          { name: "Twilio", role: "Calls the nurse when an alert escalates.", tech: "Needs a public URL, e.g. ngrok" },
        ],
      },
      {
        name: "Interfaces",
        blocks: [
          { name: "React dashboard", role: "Rooms, active alerts and a live radar map.", tech: "Vite; alerts 5 s, rooms 3 s, map 150 ms" },
          { name: "Nurse phone", role: "Receives the Twilio call.", tech: "Twilio voice" },
        ],
      },
    ],
    links: [
      { from: "ESP32 #1", to: "ROS 2", label: "/vibration, Int32 pulse width in µs" },
      { from: "ESP32 #2", to: "ROS 2", label: "/mouvement, Int32, 0 or 1" },
      { from: "Radar", to: "Backend", label: "TLVs 1010 to 1021, one packet per 55 ms frame" },
      { from: "Backend", to: "Dashboard", label: "GET /mmwave/frame, polled every 150 ms" },
      { from: "Apple Watch", to: "Backend", label: "POST /api/health-data every 1 s" },
      { from: "Fall detector", to: "Alerts", label: "gap at the deadline: radar falls reach the map but do not create a fall_detected alert" },
    ],
  },
  stages: [
    {
      date: "Jan. 24, 11:27 to 15:18",
      phase: "Requirements",
      title: "An event contract before any hardware",
      summary:
        "Falls in seniors often go unwitnessed, and staff learn late. The first commits fixed what every sensor would send: one event shape, 17 event types and three urgency levels. That contract let firmware, backend and dashboard work in parallel.",
      points: [
        "Brief: on-premises assistant for Quebec CHSLDs, no cameras, privacy first.",
        "Every event carries event_id, ts, device_id, resident_id, type, confidence, signals, context, severity and meta.",
        "Signals planned: mmwave, lidar, vibration, bed_weight, pir, co2, door and mic_keyword.",
        "Alerts move through three states: VERIFYING, ESCALATED and RESOLVED.",
      ],
      stats: [
        { value: "17", label: "event types" },
        { value: "8", label: "signal sources planned" },
        { value: "3", label: "alert states" },
      ],
      media: [{ src: `${D}/brief.webp`, caption: "Portfolio brief: the problem, the stack and the claims this page checks against the code", kind: "document", shape: "wide" }],
      tables: [
        {
          caption: "Event types grouped by how the backend treats them (backend/constants.py, services/event_processor.py)",
          head: ["Group", "Types", "Handling"],
          rows: [
            ["Fall and voice", "fall_detected, distress_voice, no_response, resident_response", "Dedicated handlers; can escalate and call the nurse"],
            ["Door", "door_exit_night, door_exit_alone, door_open_unusual", "Fixed severity from the door rule"],
            ["Passive", "vitals_reading, sleep_state, bed_occupancy, presence_motion, air_quality_reading", "Stored in passive_signals; air quality checked against limits"],
            ["Device", "device_heartbeat", "Upserts the device as online"],
            ["Other", "help_keyword, prolonged_immobility, bed_exit_unusual, air_quality_alert", "Gemini triage decides priority and whether to alert"],
          ],
        },
      ],
    },
    {
      date: "Jan. 24, 15:09 to 18:44",
      phase: "Sensor choice",
      title: "Five sensing ideas, three on the floor at demo time",
      summary:
        "The radar tracks people in 3D without an image. The vibration sensor and PIR are cheap backups on their own ESP32 boards. The watch adds heart rate. Two ideas stayed in the contract but never reached code.",
      media: [
        { src: "/media/nursie/mmwave-radar.webp", caption: "TI IWR6843ISK-ODS radar on its stand", kind: "photo", shape: "tall" },
        { src: "/media/nursie/vibration-node.webp", caption: "SENS-23 vibration sensor wired to ESP32 #1", kind: "photo", shape: "tall" },
        { src: "/media/nursie/door-sensor.webp", caption: "Magnetic door contact tried on a box door", kind: "photo", shape: "tall" },
      ],
      iterations: [
        {
          name: "mmWave radar, TI IWR6843ISK-ODS",
          summary: "TI 3D People Tracking firmware streams tracked targets, their height and their velocity over UART.",
          verdict: "kept",
          reason: "It gives position, height and vertical speed per person with no camera. The fall detector runs on these tracks.",
        },
        {
          name: "Radar vital signs viewer",
          summary: "The README describes a vital signs mode: breath rate and heart rate from TLV 0x410, a 136-byte payload.",
          verdict: "dropped",
          reason: "The viewer script is not in the repository. The runner and backend load the people tracking config instead.",
        },
        {
          name: "SENS-23 floor vibration sensor on ESP32 #1",
          summary: "A digital output on GPIO4. The firmware measures the pulse width in microseconds.",
          verdict: "kept",
          reason: "Published on /vibration from 17:57. An LED on GPIO2 lights when a pulse exceeds 1000 µs.",
        },
        {
          name: "PIR motion sensor on ESP32 #2",
          summary: "Reads a GPIO every 50 ms and publishes 0 or 1 on /mouvement.",
          verdict: "kept",
          reason: "A second ESP project was created at 18:11 so motion and vibration fail independently.",
        },
        {
          name: "Magnetic door contact",
          summary: "The door service targets Raspberry Pi GPIO and raises night exit alerts.",
          verdict: "revised",
          reason: "No door firmware exists. The service runs in mock mode and the demo drives it through POST /door/simulate.",
        },
        {
          name: "Apple Watch app",
          summary: "Sends heart rate and accelerometer readings to /api/health-data every 1 s.",
          verdict: "kept",
          reason: "Added at 18:44. A 2.5 g acceleration check exists in MotionManager but is not part of the payload.",
        },
        {
          name: "LiDAR and bed weight",
          summary: "Both are listed as signals in the event contract.",
          verdict: "dropped",
          reason: "No driver, topic or handler for either exists in the code.",
        },
      ],
    },
    {
      date: "Jan. 24, 15:09 to 20:42",
      phase: "Radar setup",
      title: "One chirp config, read back as range and speed limits",
      summary:
        "The backend sends ODS_6m_default.cfg line by line over the CLI UART at 115200 baud, with 30 ms between lines. Then it reads binary frames on the data UART at 921600 baud. Commit 20:02 reads 'Uart seems to find people'.",
      stats: [
        { value: "8.4 cm", label: "range resolution" },
        { value: "±4.6 m/s", label: "max radial speed" },
        { value: "18.2", label: "frames per second" },
      ],
      media: [{ src: `${D}/chirp-cfg.webp`, caption: "The chirp, frame and tracker lines from the config Nursie loads", kind: "screenshot", shape: "wide" }],
      tables: [
        {
          caption: "profileCfg and frameCfg values in ODS_6m_default.cfg",
          head: ["Parameter", "Value", "Meaning"],
          rows: [
            ["Start frequency", "60.75 GHz", "Bottom of the chirp"],
            ["Idle time", "30.00 µs", "Gap between chirps"],
            ["Ramp end time", "59.10 µs", "Length of one chirp ramp"],
            ["Frequency slope", "54.71 MHz/µs", "How fast the chirp sweeps"],
            ["ADC samples", "96", "Samples per chirp"],
            ["Sample rate", "2950 ksps", "Complex ADC output"],
            ["TX antennas", "3 (chirpCfg masks 1, 2, 4)", "Time-multiplexed, one chirp each"],
            ["Loops per frame", "96", "Chirp triplets per frame"],
            ["Frame period", "55.00 ms", "One tracker update"],
            ["Tracking box", "x -4 to 4 m, y 0 to 8 m, z 0 to 3 m", "boundaryBox"],
            ["Sensor mount", "2 m high, 15° down tilt", "sensorPosition 2 0 15"],
          ],
        },
      ],
      calcs: [
        {
          title: "Range resolution and maximum range",
          given: ["S = 54.71 MHz/µs", "N = 96 samples", "fs = 2.95 Msps", "c = 3.0 × 10^8 m/s"],
          steps: [
            "Sampling time = N / fs = 96 / 2.95 Msps = 32.54 µs",
            "Swept bandwidth B = S × 32.54 µs = 1780 MHz",
            "Range resolution = c / (2B) = 3.0e8 / (2 × 1.780e9) = 0.0843 m",
            "Max range from the IF limit = fs × c / (2S) = 2.95e6 × 3.0e8 / (2 × 54.71e12) = 8.09 m",
          ],
          result: "8.4 cm resolution and an 8.09 m ceiling. The tracking box stops at 8 m. TI's guide table lists 0.084 m and 7.2 m for its reference chirp.",
          source: "ODS_6m_default.cfg lines 15 and 19; TI 3D People Tracking user guide parameter table",
          proof: { src: `${D}/chirp-cfg.webp`, caption: "Config lines used in the working", kind: "screenshot" },
        },
        {
          title: "Velocity limits and frame rate",
          given: ["f0 = 60.75 GHz", "Tc = 30.00 + 59.10 = 89.10 µs", "3 TX in sequence", "96 loops, 55 ms frame"],
          steps: [
            "Wavelength λ = c / f0 = 3.0e8 / 60.75e9 = 4.94 mm",
            "Time between chirps on the same TX = 3 × 89.10 µs = 267.3 µs",
            "Max radial speed = λ / (4 × 267.3 µs) = 4.62 m/s",
            "Speed resolution = λ / (2 × 96 × 267.3 µs) = 0.096 m/s",
            "Active chirping = 96 × 267.3 µs = 25.7 ms of each 55 ms frame",
            "Update rate = 1 / 0.055 s = 18.2 Hz",
          ],
          result: "The fall gate of -1.0 m/s sits about 10 speed bins from zero and well inside ±4.62 m/s. A 0.5 s confirmation spans about 9 frames.",
          source: "ODS_6m_default.cfg lines 15 to 19; fall_detection.py line 43",
          proof: { src: `${D}/chirp-cfg.webp`, caption: "Config lines used in the working", kind: "screenshot" },
        },
      ],
    },
    {
      date: "Jan. 24, 17:27 to 23:43",
      phase: "Firmware and messages",
      title: "Two ESP32 boards, micro-ROS over Wi-Fi, one radar on UART",
      summary:
        "Each ESP32 runs two FreeRTOS tasks. A sensor task samples the pin and overwrites a one-slot queue. A micro-ROS task drains that queue and publishes. A slow network never blocks sampling, and only the newest reading is sent.",
      points: [
        "ESP32 #1 samples vibration every 10 ms in a priority 4 task with a 4096-byte stack. The micro-ROS task runs at priority 5 with 12288 bytes.",
        "ESP32 #2 samples the PIR every 50 ms. Its micro-ROS task uses the Kconfig default of 8000 bytes at priority 5.",
        "Both connect to a micro-ROS agent over UDP port 8888. Startup pings the agent 15 times at 1 s, then tries autodiscovery, then retries middleware init 5 times.",
        "Commit 17:27: 'ros works over wifi. vibration sensor works'. Firmware MVP merged at 22:15.",
        "The backend subscribes with rclpy and rebroadcasts each message as JSON on WebSocket port 8765.",
        "Radar frames resync on the magic word 02 01 04 03 06 05 08 07 before TLVs are decoded.",
      ],
      media: [
        { src: `${D}/architecture.webp`, caption: "Data path as built, from sensors to the nurse's phone", kind: "drawing", shape: "wide" },
        { src: `${D}/firmware-esp1.webp`, caption: "ESP32 #1: pin map, 10 ms sample period and the two task priorities", kind: "screenshot", shape: "tall" },
      ],
      tables: [
        {
          caption: "Message formats in the code",
          head: ["Link", "Format", "Rate"],
          rows: [
            ["ESP32 #1 to ROS 2", "/vibration, std_msgs/Int32, pulse width in µs (0 on timeout)", "10 ms loop plus read time"],
            ["ESP32 #2 to ROS 2", "/mouvement, std_msgs/Int32, 0 or 1", "50 ms loop"],
            ["ROS 2 to dashboard", "WebSocket JSON {ts, topic, type, data}", "Per message"],
            ["Radar to backend", "Header plus TLVs 1010 targets, 1011 index, 1012 height, 1020 points, 1021 presence", "One packet per 55 ms frame"],
            ["Backend to dashboard", "GET /mmwave/frame: frameNumber, targets {tid, x, y, z, vx, vy, vz}, fallEvents", "Polled every 150 ms"],
            ["Watch to backend", "POST /api/health-data {heart_rate, accelerometer, device_id, timestamp}", "Every 1 s"],
          ],
        },
      ],
      calcs: [
        {
          title: "Vibration loop rate when the floor is quiet",
          given: ["Pulse timeout = 20 000 µs", "Sample period = 10 ms", "Reader tries an active-high pulse, then active-low"],
          steps: [
            "No pulse: the high attempt waits out one 20 ms timeout",
            "The low attempt then waits out a second 20 ms timeout",
            "Loop time = 20 + 20 + 10 = 50 ms",
            "Quiet rate = 1 / 0.050 s = 20 readings per second",
          ],
          result: "About 20 Hz when quiet, faster while pulses arrive. Each read publishes 0 or a pulse width.",
          source: "Firmware/ESP1/main/vibration_pulse_reader_gpio.c and hello_world_main.c lines 65 to 72",
          proof: { src: `${D}/firmware-esp1.webp`, caption: "Timeout and sample period defines", kind: "screenshot" },
        },
      ],
    },
    {
      date: "Jan. 24, 20:42 to Jan. 25, 01:48",
      phase: "Fall and alert logic",
      title: "A two-stage radar fall detector and rule-based alerts",
      summary:
        "Version 1 at 20:42 fired on one rapid height collapse. Version 2 at 01:04 added a baseline floor, a ratio test and a stillness hold, plus a smoketest. A person who bends down and stands up no longer raises a fall.",
      media: [
        { src: `${D}/fall-states.webp`, caption: "Detector states and the thresholds between them", kind: "drawing", shape: "wide" },
        { src: `${D}/fall-config.webp`, caption: "FallDetectorConfig defaults", kind: "screenshot" },
        { src: `${D}/fusion-branch.webp`, caption: "Backend fall handler: mmWave or vibration, either one, gives a HIGH alert", kind: "screenshot", shape: "wide" },
      ],
      iterations: [
        {
          name: "Detector v1 (20:42)",
          summary: "Height drop of 0.55 m within 1 s from a standing height of 1.20 m, with a -1.0 m/s downward speed.",
          verdict: "revised",
          reason: "One collapse was enough to fire, with no hold. The v2 code comment names bending down as the false positive it removes.",
        },
        {
          name: "Detector v2 (01:04)",
          summary: "Candidate on collapse, then confirmed only if the person stays low and still for 0.5 s.",
          verdict: "kept",
          reason: "The smoketest fires on a fall and stays silent on a slow sit. It passes when run today.",
          media: { src: `${D}/smoketest.webp`, caption: "Smoketest output and the event it emits", kind: "screenshot" },
        },
      ],
      tables: [
        {
          caption: "Fall detector thresholds (fall_detection.py)",
          head: ["Rule", "Value"],
          rows: [
            ["Height", "maxZ minus minZ of the tracked target"],
            ["Baseline", "90th percentile of height over the last 3 s, at least 0.95 m"],
            ["Low posture", "height ≤ max(0.75 m, 0.65 × baseline)"],
            ["Collapse", "baseline minus height ≥ 0.55 m"],
            ["Downward speed", "min vz ≤ -1.0 m/s in the last 1 s, required whenever vz is reported"],
            ["Cancel", "height rises above the low threshold plus 0.10 m"],
            ["Confirm", "0.5 s later: still low, horizontal speed ≤ 0.45 m/s, |vz| ≤ 0.60 m/s"],
            ["Recover", "height ≥ max(0.80, 0.85 × 1.20) = 1.02 m for 0.8 s"],
            ["Cooldown", "3 s between candidates per target"],
          ],
        },
        {
          caption: "Other alert rules in the backend",
          head: ["Input", "Rule", "Result"],
          rows: [
            ["fall_detected", "signals.mmwave or signals.vibration true", "HIGH alert, ElevenLabs verbal check webhook (3 s timeout)"],
            ["fall_detected", "neither signal", "MEDIUM alert, 'Low Confidence'"],
            ["Door open, room empty", "21:00 to 07:00", "door_exit_night, high, state ESCALATED"],
            ["Door open, room empty", "daytime", "door_exit_alone, medium"],
            ["Door open, person present", "any time", "door_open_unusual, low"],
            ["CO2 / VOC / PM2.5", "1000 / 500 / 35 warn; 1500 / 1000 / 55 critical", "medium or high air quality alert"],
          ],
        },
      ],
      calcs: [
        {
          title: "Confidence of the smoketest fall",
          given: ["Baseline 1.55 m, height 0.50 m", "min vz -1.5 m/s, z drop 0.65 m", "Horizontal speed 0.0 m/s"],
          steps: [
            "Height term = (1.05 - 0.55) / 0.55 = 0.909",
            "Speed term = (1.5 - 1.0) / 1.0 = 0.500",
            "Z drop term = 0.5 × (0.65 - 0.55) / 0.55 = 0.091",
            "Stillness term = (0.45 - 0.0) / 0.45 = 1.000",
            "Confidence = min(1, 2.500 / 2.5) = 1.0",
          ],
          result: "Triggered at 1.9 s, 0.3 s after the collapse began, with confidence 1.0 and reason height_collapse+downward_vz+still.",
          source: "fall_detection.py scoring lines 354 to 363; fall_detection_smoketest.py scenario",
          proof: { src: `${D}/smoketest.webp`, caption: "Detector output for the smoketest fall", kind: "screenshot" },
        },
      ],
    },
    {
      date: "Jan. 24, 19:27 to Jan. 25, 01:46",
      phase: "Backend and voice",
      title: "Flask, MongoDB, Gemini triage, ElevenLabs and Twilio",
      summary:
        "Every event lands in one EventProcessor. Falls, voice outcomes and door exits follow fixed rules. Events without a rule go to Gemini, which returns a priority, an alert flag and an action line.",
      points: [
        "MongoDB collections: alerts, events, devices and passive_signals. Each alert keeps a history array of state changes.",
        "Gemini reads the event type, severity and signals and must answer 'Priority', 'ShouldAlert' and 'Action'. On any error it returns MEDIUM and alerts.",
        "On a fall, the backend POSTs event, resident, room and alert id to the verbal check webhook. The ElevenLabs agent then asks the resident if they are okay.",
        "A resident answer resolves the alert. No answer or a distress phrase escalates it and places a Twilio call to the nurse.",
        "Twilio fetches its call script from a public base URL, so the README suggests a tunnel such as ngrok.",
      ],
      media: [{ src: `${D}/architecture.webp`, caption: "Where the backend sits between sensors, cloud services and the dashboard", kind: "drawing", shape: "wide" }],
      tables: [
        {
          caption: "Alert state changes (event_processor.py)",
          head: ["Event", "From", "To", "Side effect"],
          rows: [
            ["fall_detected", "none", "VERIFYING", "ElevenLabs verbal check"],
            ["resident_response", "VERIFYING or ESCALATED", "RESOLVED", "History entry with the answer"],
            ["no_response", "VERIFYING or ESCALATED", "ESCALATED, high", "Twilio call to the nurse"],
            ["distress_voice", "VERIFYING or ESCALATED", "ESCALATED, high", "Twilio call, 3D tracking scenario flag"],
          ],
        },
      ],
    },
    {
      date: "Jan. 25, 01:04 to 04:03",
      phase: "Dashboard and demo",
      title: "A nurse dashboard and the Best Use of ElevenLabs prize",
      summary:
        "The React dashboard shows each room's heart rate, presence and last activity, with active alerts on the right. Commit 01:36 reads 'everything integrated'. The dashboard landed at 03:25 and the last polish at 04:03.",
      points: [
        "Alerts refresh every 5 s, room details every 3 s and the radar map every 150 ms.",
        "Live ROS topics /mouvement and /vibration arrive over the WebSocket on port 8765.",
        "The radar map draws each tracked person and marks fall events from the detector.",
        "Gap left at the deadline: radar fall events reach the map but do not create a fall_detected alert. That alert comes from the ElevenLabs webhook or POST /events.",
      ],
      stats: [
        { value: "38", label: "commits" },
        { value: "16 h 36 min", label: "first to last commit" },
        { value: "Won", label: "Best Use of ElevenLabs" },
      ],
      media: [
        { src: `${D}/dashboard.webp`, caption: "Nurse dashboard: five rooms and one active fall alert", kind: "screenshot", shape: "wide" },
        { src: `${D}/dashboard-alert.webp`, caption: "Room 105 flagged with the fall alert card", kind: "screenshot", shape: "wide" },
        { src: `${D}/build-timeline.webp`, caption: "Commit timeline across the hackathon", kind: "chart", shape: "wide" },
      ],
    },
  ],
  sources: [
    "Nursie git repository: 38 commits from Jan. 24, 11:27 to Jan. 25, 04:03, 2026",
    "Firmware/ESP1 and ESP2 (ESP-IDF, FreeRTOS, micro-ROS) source and Kconfig",
    "3D_People_Tracking chirp config ODS_6m_default.cfg, TI user guide, pcount3d_uart parser, fall detector and smoketest",
    "backend: Flask app, event processor, door, LLM, Twilio, mmWave UART and ROS 2 WebSocket services",
    "frontend-vite React dashboard and WatchApp Swift source",
    "Portfolio pages 5 and 6 and the build photos",
  ],
};

export default dive;
