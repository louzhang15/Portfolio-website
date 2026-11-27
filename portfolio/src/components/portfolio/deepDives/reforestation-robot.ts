import type { TechDive } from "./types";

const dive: TechDive = {
  heading: "Four test sketches, one assembled robot",
  intro:
    "The robot's code is four test sketches and one assembled sketch. The test sketches cover colour detection, a drive test, the seed dispenser and the line follower, saved on Feb. 15, 2025. Final_Code_Assembled.ino runs all of them in one loop and was committed on Feb. 24, 2025. Steering is on/off logic from two infrared sensors. No sketch contains a PID loop.",
  architecture: {
    flow:
      "Each loop reads both infrared sensors, then the three colour channels. A green or blue reading stops the motors and runs two dispenser sweeps. The infrared pair then picks one of four steering cases. The loop ends with a 500 ms delay, so one pass takes at least 1.1 s.",
    layers: [
      {
        name: "Sensors",
        blocks: [
          { name: "Infrared pair", role: "HIGH means the sensor sees the black line.", tech: "Right pin 11, left pin 12" },
          { name: "Colour sensor", role: "Red, green and blue read one at a time as pulse widths.", tech: "S0 to S3 on pins 4 to 7, OUT on 8, 20% scaling" },
        ],
      },
      {
        name: "Controller",
        blocks: [
          { name: "Assembled sketch", role: "One loop: read, decide, drive. Lowest pulse width wins the colour.", tech: "Final_Code_Assembled.ino, Arduino C++" },
        ],
      },
      {
        name: "Actuators",
        blocks: [
          { name: "Wheel motors", role: "Two DC motors through a driver board. Only direction pins are written.", tech: "Right 2 and 3, left 4 and 5" },
          { name: "Dispenser servo", role: "Two sweeps 0° to 120° and back at 10 ms per step.", tech: "Servo library, pin 12" },
        ],
      },
      {
        name: "Mechanics",
        blocks: [
          { name: "Paper dispenser", role: "Drops seeds from the cup when the servo turns.", tech: "Folded paper, seed cup" },
          { name: "Chassis", role: "Carries the board, breadboard, driver and dispenser.", tech: "Cardboard" },
        ],
      },
    ],
    links: [
      { from: "Infrared pair", to: "Sketch", label: "digitalRead() on pins 11 and 12 once per loop" },
      { from: "Colour sensor", to: "Sketch", label: "3 pulseIn() reads on pin 8, each followed by 200 ms" },
      { from: "Sketch", to: "Wheel motors", label: "digitalWrite() on 2 to 5; enables 6 and 7 never written" },
      { from: "Sketch", to: "Servo", label: "operateSeedDispenser() on a green or blue reading" },
    ],
  },
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
        "The assembled sketch fixes this. Its reverse loop runs while pos >= 0, so each sweep goes 0° to 120° and back.",
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
        "The assembled sketch drops the Timer0 change and moves the motors to pins 2 to 7, so its delays run at normal speed.",
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
      date: "Feb. 24, 2025",
      phase: "Integration",
      title: "One assembled sketch runs all three subsystems",
      summary:
        "Final_Code_Assembled.ino joins the four test sketches in one loop. It reads both infrared sensors, then red, green and blue. A green or blue reading stops the motors and runs the seed dispenser. Then the infrared pair sets the steering.",
      points: [
        "Steering starts both wheels at MOTOR_SPEED 180 and adds or removes an offset of 20. There is no error term and no PID.",
        "rotateMotor() adds another 20 to the right wheel. A stop command of 0 therefore leaves the right wheel's direction pins set to forward.",
        "The left-sensor case applies the same offsets as the straight case. Only the both-black case differs.",
        "No analogWrite() call is made. The speed values only pick each wheel's direction, so all three moving cases drive both wheels forward.",
        "operateSeedDispenser() sweeps the servo 0° to 120° and back twice, at 10 ms per step.",
        "The pin clash from the test sketches remains. S0 to S3 share pins 4 to 7 with the left motor inputs and both enable pins. The servo is attached to pin 12, which is also the left infrared input.",
        "Each colour read writes S2 and S3 on pins 6 and 7. If the enables are wired as declared, every colour read also switches the motor driver's enable inputs.",
      ],
      stats: [
        { value: "230", label: "lines in the assembled sketch" },
        { value: "5", label: "shared pins" },
        { value: "1.1 s", label: "fixed delay per loop" },
        { value: "4.84 s", label: "per dispense" },
      ],
      tables: [
        {
          caption: "Steering in the assembled sketch (Final_Code_Assembled.ino, lines 120 to 146 and rotateMotor())",
          head: ["Right sensor", "Left sensor", "Right command", "Left command", "Wheels"],
          rows: [
            ["White", "White", "160 + 20 = 180", "200", "Both forward"],
            ["Black", "White", "200 + 20 = 220", "160", "Both forward"],
            ["White", "Black", "160 + 20 = 180", "200", "Both forward"],
            ["Black", "Black", "0 + 20 = 20", "0", "Right forward, left stopped"],
          ],
        },
        {
          caption: "Pin use in Final_Code_Assembled.ino",
          head: ["Pin", "Job 1", "Job 2"],
          rows: [
            ["2, 3", "Right motor direction", ""],
            ["4", "Left motor input 1", "Colour S0"],
            ["5", "Left motor input 2", "Colour S1"],
            ["6", "Right motor enable", "Colour S2"],
            ["7", "Left motor enable", "Colour S3"],
            ["8", "Colour OUT", ""],
            ["11", "Right infrared sensor", ""],
            ["12", "Left infrared sensor", "Servo signal"],
          ],
        },
      ],
      calcs: [
        {
          title: "One loop period",
          given: ["3 colour reads, each followed by delay(200)", "delay(500) at the end of loop()", "pulseIn() waits for one low pulse, up to 1 s by default"],
          steps: [
            "Colour delays = 3 × 200 ms = 600 ms",
            "Fixed delay per loop = 600 ms + 500 ms = 1,100 ms",
            "Loop period = 1.1 s + the time of 3 pulseIn() reads",
            "Infrared reads per second ≤ 1 / 1.1 s = 0.91",
          ],
          result: "At least 1.1 s per loop, so the line sensors are checked under once a second. The line-follower test sketch checked them about every 62.5 ms.",
          source: "Final_Code_Assembled.ino, lines 72 to 77 and 148",
        },
        {
          title: "Time for one dispense",
          given: ["Forward sweep 0° to 120° = 121 writes", "Reverse sweep 120° to 0° = 121 writes", "Delay per step 10 ms, 2 sweeps"],
          steps: ["One sweep = (121 + 121) × 10 ms = 2,420 ms", "Two sweeps = 2 × 2.42 s = 4.84 s"],
          result: "A green or blue reading adds 4.84 s, so that loop takes at least 5.94 s.",
          source: "Final_Code_Assembled.ino, lines 158 to 174",
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
    "Final_Code_Assembled.ino in the public RoboHacks-2025 repo (commit of Feb. 24, 2025)",
    "Two photos of the robot taken at RoboHacks",
  ],
};

export default dive;
