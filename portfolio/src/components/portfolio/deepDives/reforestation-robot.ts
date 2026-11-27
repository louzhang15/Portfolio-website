import type { TechDive } from "./types";

const dive: TechDive = {
  heading: "Four Arduino sketches, one robot",
  intro:
    "The robot's code is four separate Arduino sketches: colour detection, a drive test, the seed dispenser and the line follower. File save times show the order they were written on Feb. 15, 2025. The steering is on/off logic from two infrared sensors. No sketch contains a PID loop.",
  stages: [
    {
      date: "Feb. 15, 03:33",
      phase: "Colour detection",
      title: "Read red, green and blue as pulse widths",
      summary:
        "The colour sensor outputs a square wave. The sketch selects one colour filter at a time and times the low pulse with pulseIn(). A shorter pulse means more of that colour.",
      points: [
        "Filter select pins S2 and S3 pick red (LOW, LOW), green (HIGH, HIGH) or blue (LOW, HIGH).",
        "S0 HIGH and S1 LOW set the output frequency scaling to 20%.",
        "The sketch waits 200 ms after each colour read and 500 ms after each result.",
        "The dominant colour is the channel with the lowest pulse width. There are no fixed thresholds. A tie prints Unknown.",
        "The file header credits a 2020 DroneBot Workshop calibration example as its starting point.",
      ],
      stats: [
        { value: "3", label: "colour channels" },
        { value: "20%", label: "frequency scaling" },
        { value: "1.1 s", label: "delays per reading" },
      ],
      tables: [
        {
          caption: "Colour sensor pins (Color_detector.ino)",
          head: ["Pin", "Signal", "Role"],
          rows: [
            ["4", "S0", "Frequency scaling, set HIGH"],
            ["5", "S1", "Frequency scaling, set LOW"],
            ["6", "S2", "Filter select"],
            ["7", "S3", "Filter select"],
            ["8", "OUT", "Pulse output, read with pulseIn()"],
          ],
        },
      ],
    },
    {
      date: "Feb. 15, 03:35",
      phase: "Drive",
      title: "A bench test for the two wheel motors",
      summary:
        "Motor_wheels.ino drives both motors forward for 3 s, then in reverse for 3 s, in a loop. It checks direction wiring before any sensor logic.",
      points: [
        "Direction pins: motor 1 on 2 and 3, motor 2 on 4 and 5.",
        "Enable pins 6 and 7 are set as outputs but never written. The motors only turn if the driver's enable inputs are held high in hardware.",
        "There is no speed control in this sketch, only direction.",
      ],
      stats: [
        { value: "3 s", label: "forward" },
        { value: "3 s", label: "reverse" },
        { value: "2", label: "DC motors" },
      ],
      media: [
        {
          src: "/media/robohacks/deep/electronics.webp",
          caption: "Motor driver board and breadboard wiring on the cardboard chassis",
          kind: "photo",
          shape: "square",
        },
      ],
    },
    {
      date: "Feb. 15, 03:36",
      phase: "Dispenser",
      title: "A servo turns the paper dispenser",
      summary:
        "Seed_Dispenser.ino sweeps a servo on pin 12 from 0° to 120° in 1° steps, 15 ms apart. A counter stops it after 2 sweeps.",
      points: [
        "The sweep back from 120° to 0° never runs. The loop condition is pos <= 0 with pos starting at 120, so it is false on the first check.",
        "The second sweep therefore starts with a jump from 120° straight to 0°.",
        "After 2 sweeps the servo holds at 120°.",
        "Drops are timed by the sketch alone. No sensor triggers them.",
      ],
      calcs: [
        {
          title: "Time for one dispenser sweep",
          given: ["Steps: 0° to 120° in 1° steps = 121 writes", "Delay per step: 15 ms", "Sweeps: 2"],
          steps: ["One sweep = 121 × 15 ms = 1,815 ms", "Two sweeps = 2 × 1.815 s = 3.63 s"],
          result: "About 1.8 s per sweep, 3.6 s for both drops",
          source: "Seed_Dispenser.ino, lines 13 to 26",
        },
      ],
      media: [
        {
          src: "/media/robohacks/deep/dispenser.webp",
          caption: "Folded paper dispenser beside the seed cup and the servo arm",
          kind: "photo",
          shape: "wide",
        },
      ],
    },
    {
      date: "Feb. 15, 11:52",
      phase: "Line following",
      title: "Two infrared sensors, four cases",
      summary:
        "Black_Line_detection.ino is the last sketch saved. It reads two digital infrared sensors and picks one of four motor commands. This is on/off steering. It has no error term, no gains and no PID.",
      points: [
        "Sensors: right on pin 11, left on pin 12. HIGH means the sensor sees black.",
        "Turns are pivot turns: one wheel forward, the other in reverse.",
        "MOTOR_SPEED is 180, but no analogWrite() call uses it. Only its sign sets each wheel's direction, so the motors run at whatever the enable inputs allow.",
        "setup() changes the Timer0 prescaler from 64 to 8. On an Uno-class board this makes delay() run 8 times fast.",
        "Every reading is printed to the Serial Monitor at 9600 baud for debugging.",
      ],
      tables: [
        {
          caption: "Steering logic (Black_Line_detection.ino, lines 64 to 86)",
          head: ["Right sensor", "Left sensor", "Right wheel", "Left wheel", "Result"],
          rows: [
            ["White", "White", "+180", "+180", "Forward"],
            ["Black", "White", "-180", "+180", "Pivot right"],
            ["White", "Black", "+180", "-180", "Pivot left"],
            ["Black", "Black", "0", "0", "Stop"],
          ],
        },
        {
          caption: "Motor driver pins (Black_Line_detection.ino)",
          head: ["Motor", "Enable", "Input 1", "Input 2"],
          rows: [
            ["Right", "6", "7", "8"],
            ["Left", "5", "9", "10"],
          ],
        },
      ],
      calcs: [
        {
          title: "Real loop period after the Timer0 change",
          given: ["Loop delay in code: 500 ms", "Default Timer0 prescaler: 64", "Prescaler set in setup(): 8"],
          steps: ["Timer0 now ticks 64 / 8 = 8 times faster", "delay() counts Timer0 ticks, so 500 ms of code time = 500 / 8 ms", "500 / 8 = 62.5 ms"],
          result: "About 62.5 ms per loop, roughly 16 sensor checks a second (assumes an ATmega328P board)",
          source: "Black_Line_detection.ino, lines 21 and 89",
        },
      ],
    },
    {
      date: "Feb. 15, demo",
      phase: "Integration",
      title: "What the files show about the final build",
      summary:
        "The folder has no combined sketch. The four sketches reuse the same pins, so they cannot run together as written. Pins 4 to 8 and pin 12 each have two jobs.",
      points: [
        "The colour sensor uses pins 4 to 8. The line follower uses 5 to 8 for the motor driver.",
        "Pin 12 is the left infrared sensor in one sketch and the servo in another.",
        "Running all three sensors at once needs a re-pinned sketch that is not in the project files.",
        "The demo photos show two wheel motors, a driver board, the paper dispenser and the seed cup on a cardboard chassis.",
      ],
      stats: [
        { value: "4", label: "sketches" },
        { value: "297", label: "lines of code" },
        { value: "6", label: "shared pins" },
      ],
      tables: [
        {
          caption: "Pin use across the four sketches",
          head: ["Pin", "Colour", "Drive test", "Dispenser", "Line follower"],
          rows: [
            ["2, 3", "", "Motor 1 direction", "", ""],
            ["4", "S0", "Motor 2 direction", "", ""],
            ["5", "S1", "Motor 2 direction", "", "Left enable"],
            ["6", "S2", "Enable 1", "", "Right enable"],
            ["7", "S3", "Enable 2", "", "Right input 1"],
            ["8", "OUT", "", "", "Right input 2"],
            ["9, 10", "", "", "", "Left inputs"],
            ["11", "", "", "", "Right IR sensor"],
            ["12", "", "", "Servo", "Left IR sensor"],
          ],
        },
      ],
      media: [
        { src: "/media/robohacks/robot-held.jpg", caption: "Top view: breadboard, Arduino, sensors and seed dispenser", kind: "photo", shape: "tall" },
        { src: "/media/robohacks/robot-top.jpg", caption: "Full assembly on the competition floor", kind: "photo", shape: "tall" },
      ],
    },
  ],
  sources: [
    "Arduino sketches: Black_Line_detection.ino, Color_detector.ino, Motor_wheels.ino, Seed_Dispenser.ino (file save times, Feb. 15, 2025)",
    "Two photos of the robot taken at RoboHacks",
  ],
};

export default dive;
