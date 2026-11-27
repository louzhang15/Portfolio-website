import type { TechDive } from "./types";

/** Built from the HackHarvard 2026 repo: agent/ and modeling/ code, READMEs, the implementation plan, eval result files and git log. */
const dive: TechDive = {
  heading: "How Trace decides who to warn, and when",
  intro:
    "Trace turns live fire and storm data into a level for each home: watch, warn or evacuate. It then plans an exit route that the hazard will not reach first. All of it was built in one day at HackHarvard 2026; the git log runs from 03:50 to 19:24 on Oct. 17.",
  stages: [
    {
      date: "Oct. 17, 2026",
      phase: "Problem",
      title: "Warnings per address, not per zone",
      summary:
        "Official alerts cover whole zones. Trace scores each subscribed home on its own, from distance, wind direction and fuel dryness.",
      points: [
        "Wildfire side: LA and Ventura counties. Storm-surge side: the US East Coast.",
        "An alert must say what to do and how long is left, not only that a fire exists.",
        "Safety facts (route, timing, steps) come from code. The LLM never writes them.",
      ],
      stats: [
        { value: "4", label: "levels: none, watch, warn, evacuate" },
        { value: "15 min", label: "between live cycles" },
        { value: "10", label: "commits in one day" },
      ],
      media: [
        {
          src: "/media/trace/eaton-fire.webp",
          caption: "Eaton 2025 replay at T+31 h: modeled spread, 3D buildings, satellite detections and the alert mix for 300 households.",
          kind: "screenshot",
          shape: "wide",
        },
      ],
    },
    {
      date: "Oct. 17, 03:50 to 07:20",
      phase: "Architecture",
      title: "Feeds in, one level per home out",
      summary:
        "The modeling pipeline writes live JSON every cycle. The sentinel reads it as a snapshot, scores every subscriber, asks a policy for a level, and sends texts, calls and signed webhooks.",
      tables: [
        {
          caption: "Data flow per cycle (sentinel run --every 15)",
          head: ["Step", "Source or module", "Output"],
          rows: [
            ["Fire detections", "NASA FIRMS VIIRS + MODIS hot spots, NIFC perimeters and incidents", "fire points with age and confirmed flag"],
            ["Fire weather", "Open-Meteo 48 h hourly grid, NWS Red Flag Warnings", "wind, gusts, humidity, 1-h fuel moisture"],
            ["Storm data", "NHC forecasts and NOAA tide gauges", "forecast surge depth and timing per address"],
            ["Roads", "OpenStreetMap via Overpass (cached), Caltrans District 7 closures (cached 5 min)", "road graph with blocked nodes"],
            ["Signals", "signals.py: distance, bearing, ETA, Red Flag, burn probability", "rule level per home"],
            ["Policy", "rules, radius, or an LLM via Chalk Model Gateway", "final level and message"],
            ["Delivery", "Photon iMessage, ElevenLabs voice over Photon SIP, HMAC-signed webhooks, MCP server", "texts, calls, agent pulls"],
          ],
        },
      ],
      points: [
        "Replays use a point-in-time snapshot: at hour h the agent sees only detections and reports known by h.",
        "Chalk Sandboxes run the 24/7 loop and the MCP endpoint, with RestartPolicy.ALWAYS.",
      ],
    },
    {
      date: "Oct. 17, 07:20",
      phase: "Arrival estimate",
      title: "Hours until the fire reaches a home",
      summary:
        "Each satellite point spreads as a wind-driven ellipse. Spread rate scales with effective wind and drops with fuel moisture. The home's ETA is its distance over the spread rate toward it, taken over all active points.",
      calcs: [
        {
          title: "Head-fire rate of spread",
          given: ["Wind 30 mph, gusts 50 mph", "1-h dead fuel moisture 4%", "k = 0.03 km/h per mph (fitted on Eaton only)"],
          steps: [
            "Effective wind = wind + 0.5 × max(0, gust − wind) = 30 + 0.5 × 20 = 40 mph",
            "Moisture damping = clip(1 − (4 − 4) / 16, 0.15, 1) = 1.0",
            "Head ROS = max(0.05, k × 40 × 1.0) = 1.2 km/h",
          ],
          result: "1.2 km/h head spread, the rate the README reports matching observed Eaton growth",
          source: "agent/sentinel/signals.py and config.py",
        },
        {
          title: "Ellipse spread and ETA for one home",
          given: ["Head ROS 1.2 km/h, effective wind 40 mph", "Home 5 km straight downwind (θ = 0°)", "Stale credit = 0 h"],
          steps: [
            "Length-to-breadth = min(8, 1 + 0.1 × 40) = 5",
            "Eccentricity e = √(1 − 1/5²) = 0.980",
            "ROS(θ) = head × (1 − e) / (1 − e·cos θ); at θ = 0°, ROS = 1.2 km/h",
            "ETA = 5 km / 1.2 km/h − min(age, 0) = 4.2 h",
            "At θ = 90° the same formula gives 0.024 km/h, so a crosswind home 5 km away has an ETA of over 200 h",
          ],
          result: "Downwind home: ETA 4.2 h. Crosswind home at the same distance: over 200 h.",
          source: "agent/sentinel/signals.py (directional_ros, assess)",
        },
      ],
      tables: [
        {
          caption: "Rule thresholds: a level fires if the ETA or the plain distance ring says so",
          head: ["Level", "Max ETA", "Max distance", "Notes"],
          rows: [
            ["Evacuate", "3 h", "3 km", "Only from a confirmed fire. An unconfirmed 911/NIFC report caps at warn."],
            ["Warn", "8 h", "8 km", "Text includes an estimated departure window."],
            ["Watch", "24 h", "15 km", "Also set before any fire: Red Flag + Santa Ana outlook + burn probability ≥ 0.3."],
          ],
        },
        {
          caption: "Storm-surge rules (fitted on Sandy and Matthew only)",
          head: ["Level", "Trigger"],
          rows: [
            ["Evacuate", "Expected forecast floods the address (≥ 0.5 ft) within 24 h, or it is flooding now"],
            ["Warn", "Expected forecast floods the address within 36 h"],
            ["Watch", "Tropical storm or hurricane within 300 km in 72 h, for an address with spill level under 20 ft"],
          ],
        },
      ],
      points: [
        "A fire point counts as active for 12 h, because satellite passes are hours apart.",
        "Worked example: the downwind home gets warn (4.2 h > 3 h, 5 km > 3 km). A home 2 km upwind gets evacuate from the 3 km ring alone.",
      ],
    },
    {
      date: "Oct. 17, 14:24 to 19:24",
      phase: "Routing",
      title: "A route the fire or water will not reach first",
      summary:
        "The router predicts when the hazard reaches every road node with the same spread model. A time-dependent shortest-path search only uses a road segment if the driver gets through it before the hazard, with slack.",
      tables: [
        {
          caption: "Router constants (agent/sentinel/routing.py)",
          head: ["Constant", "Value", "Role"],
          rows: [
            ["MARGIN_H", "0.25 h", "required slack between the driver and the fire at each node"],
            ["RISK_ZONE_H / RISK_WEIGHT", "3 h / 2.0", "nodes the fire reaches within 3 h cost up to 3× more"],
            ["CONGESTION_ZONE_H", "6 h", "roads the fire could reach in 6 h are assumed jammed"],
            ["Jam speed factor", "0.60 motorway to 0.30 residential", "share of free-flow speed left during evacuation"],
            ["SAFE_ETA_H / MIN_ESCAPE_KM", "24 h / 5 km", "a destination must be this far from the front and the house"],
            ["BLOCK_KM", "0.25 km", "nodes this close to a Caltrans full closure are impassable"],
            ["MAX_POPS", "400,000", "search cap per request"],
          ],
        },
      ],
      calcs: [
        {
          title: "Cost of one road segment in the jam zone",
          given: ["1 km residential road, free flow 30 km/h, jam factor 0.30", "Fire reaches the far node in 1.5 h", "Driver reaches it at t = 0.5 h"],
          steps: [
            "Speed = 30 × 0.30 = 9 km/h, so dt = 1 / 9 = 0.111 h (6.7 min)",
            "Usable? t + dt + 0.25 = 0.86 h ≤ 1.5 h, yes",
            "Risk = max(0, (3 − 1.5) / 3) = 0.5",
            "Search cost = dt × (1 + 2.0 × 0.5) = 0.222 h",
          ],
          result: "The segment stays open but costs twice its travel time, so the search prefers roads away from the front.",
          source: "agent/sentinel/routing.py (_search)",
        },
        {
          title: "Latest safe departure",
          given: ["Fire ETA 4.2 h, confirmed", "Travel time 45 min (default when no route time exists)"],
          steps: [
            "Buffer = travel × 1.5 + 20 min = 87.5 min",
            "Latest departure = now + 4.2 h − 1.46 h = now + 2.7 h",
            "Confidence = medium (confirmed, but ETA over 3 h)",
          ],
          result: "Leave within about 2.7 h. No window is shown when the ETA is over 12 h.",
          source: "agent/sentinel/windows.py",
        },
      ],
      points: [
        "If no route clears the margin, the search runs again with no margin and the text says no safe route exists.",
        "Text commands: NOW returns the live route, WINDOW the departure window, STATUS the latest level, LEFT records departure and stops reminders.",
      ],
    },
    {
      date: "Oct. 17",
      phase: "Decisions",
      title: "What the replays changed",
      summary: "Most choices were set by replaying real fires and storms, then keeping what held up on the event left out of the fit.",
      iterations: [
        {
          name: "Google Routes with a fire-point filter",
          summary: "First plan: call Google Routes, reject routes passing near current fire points.",
          verdict: "dropped",
          reason: "The plan lists it as a proxy that does not predict when fire reaches a road, plus per-request cost and terms. Replaced by the in-house OSM router.",
        },
        {
          name: "Time-dependent search on OpenStreetMap roads",
          summary: "Fire ETA per road node, slack margin, risk cost and Caltrans closures.",
          verdict: "kept",
          reason: "Route eval: 85.2% of fire routes and 86.0% of surge routes stayed clear in reality, vs 82.7% and 78.9% for the plain fastest route.",
        },
        {
          name: "Full credit for unseen fire travel",
          summary: "Treat every old satellite point as a front that kept moving since it was seen.",
          verdict: "dropped",
          reason: "On Eaton it pushed over-evacuation to 20% or more. The fitted credit is 0 h.",
        },
        {
          name: "2 km evacuate ring",
          summary: "The ring the Eaton-only fit picked.",
          verdict: "revised",
          reason: "It scored worse on held-out Palisades (72% vs 76% evacuated in time), so the default is 3 km.",
        },
        {
          name: "Evacuate on unconfirmed reports",
          summary: "Trust every NIFC or 911 report as a real fire.",
          verdict: "revised",
          reason: "Live NIFC listed about 48 active incidents in the box, most tiny. Unconfirmed reports now cap at warn, which costs 10 points of on-time evacuations.",
        },
        {
          name: "Twilio SMS, no outbound calls",
          summary: "Early plan: Twilio texts, and people call the agent.",
          verdict: "revised",
          reason: "Texts moved to Photon iMessage. The last commit added an ElevenLabs voice agent that places calls over Photon SIP.",
        },
        {
          name: "Hourly fire polygons on the map",
          summary: "First web replay drew one polygon per hour.",
          verdict: "revised",
          reason: "Replaced at 12:21 by shader and three.js fire spread, then 3D buildings and a thermal view.",
        },
        {
          name: "Surge rules on the high scenario",
          summary: "Decide on the 1.6× worst-case surge instead of the expected forecast.",
          verdict: "dropped",
          reason: "It evacuated far more low but dry homes on Sandy and Matthew with no gain in on-time evacuations.",
        },
      ],
    },
    {
      date: "Oct. 17",
      phase: "Evaluation",
      title: "No-hindsight replays of 5 fires and 4 storms",
      summary:
        "Ground truth is the first satellite detection within 750 m of a home, which neither the agent nor the spread model produces. Destroyed homes come from CAL FIRE damage inspections.",
      tables: [
        {
          caption: "Eaton + Palisades, 600 subscribers (100 destroyed, 100 undamaged, 100 outside per fire)",
          head: ["Policy", "Warned in time", "Evacuated in time", "Median warn lead", "Median evac lead", "Over-evac", "False warn", "Alerts per sub"],
          rows: [
            ["Radius (distance rings only)", "100%", "92.5%", "8.7 h", "4.4 h", "4%", "6%", "1.5"],
            ["Rules (wind ETA + rings, confirmation cap)", "100%", "82.5%", "8.7 h", "4.4 h", "4%", "6%", "2.7"],
          ],
        },
        {
          caption: "Model checks against reality",
          head: ["Model", "Result", "Held out or baseline"],
          rows: [
            ["Rothermel spread, Palisades", "85% shape overlap (Sørensen), 99% of destroyed homes reached", "62% overlap with params fitted without it"],
            ["Rothermel spread, Eaton", "54% shape overlap, 84% of destroyed homes reached", "42% overlap held out"],
            ["Burn probability, 806,129 cells", "AUC 0.74, top 10% of cells hold 20.6% of burns", "fire history alone: AUC 0.71, 16.4%"],
            ["Surge rules, Irma + Isabel", "100% of flooded homes evacuated in time, median 30.6 h ahead", "official-zone baseline: 70%, 28.2 h"],
            ["Evac routes, Sandy", "91.7% stayed clear of flooding", "fastest route: 60.0%"],
            ["Evac routes, Irma", "91.7% stayed clear", "fastest route: 65.0%"],
          ],
        },
      ],
      points: [
        "Distance rings beat the wind model on these two fires (92.5% vs 82.5%). The README reports it as is.",
        "The surge rules pay for their lead time: 65% needless evacuations on the held-out storms vs 46.7% for official zones.",
        "Caveats from the README: arrival times are limited to satellite passes, hourly reanalysis stands in for a forecast, and two fires is a small sample.",
      ],
      media: [
        {
          src: "/media/trace/palisades-fire.webp",
          caption: "Palisades 2025 replay at T+12 h: 85% shape overlap with the CAL FIRE perimeter, 62% held out.",
          kind: "screenshot",
          shape: "wide",
        },
        {
          src: "/media/trace/sandy-surge.webp",
          caption: "Hurricane Sandy replay: NHC cone, wind radii and modeled vs observed peak surge at three NY and NJ gauges.",
          kind: "screenshot",
          shape: "wide",
        },
        {
          src: "/media/trace/matthew-surge.webp",
          caption: "Hurricane Matthew replay, one of the two storms the surge model was fitted on.",
          kind: "screenshot",
          shape: "wide",
        },
      ],
      stats: [
        { value: "100%", label: "destroyed homes warned in time" },
        { value: "8.7 h", label: "median warning lead" },
        { value: "33", label: "unit tests passing" },
      ],
    },
  ],
  sources: [
    "agent/README.md and modeling/README.md",
    "agent/docs/IMPLEMENTATION_PLAN.md (locked decisions, test results, known gaps)",
    "agent/sentinel/signals.py, config.py, routing.py, windows.py, closures.py, channels/voice.py",
    "agent/surge_sentinel/config.py and modeling/surge/model.py",
    "modeling/out/sentinel/replay.json, surge/sentinel/replay.json, incidents/*/incident.json, risk_model_metrics.json",
    "agent/evals/data/route_eval.json",
    "Git log of the HackHarvard 2026 repo, Oct. 17, 2026",
  ],
};

export default dive;
