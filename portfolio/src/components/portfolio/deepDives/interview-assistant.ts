import type { TechDive } from "./types";

/** Built from the Virtual_interviewing_assistant repo (same files as the local Marihacks folder): AI_test.py, AI_model.py, draft.py, README and git log. */
const dive: TechDive = {
  heading: "How the Interview Assistant runs a spoken interview",
  intro:
    "The assistant asks an interview question out loud, records the spoken answer, transcribes it, and reads back feedback. It is a Python script on OpenAI's speech and chat APIs. The repo holds two voice loops: the interview script and a second, always-listening assistant.",
  architecture: {
    flow:
      "One Python script runs each round in order. Audio files on disk pass data between the steps: question.mp3, answer.wav and response.mp3. Each answer is judged on its own, with no memory of earlier answers.",
    layers: [
      {
        name: "Input",
        blocks: [
          { name: "Question bank", role: "Picks one question at random and removes it once asked.", tech: "Python list, tiers 0 to 3" },
          { name: "Microphone", role: "Records for a fixed time set by the question tier.", tech: "PyAudio, 16-bit mono, 44,100 Hz" },
        ],
      },
      {
        name: "OpenAI APIs",
        blocks: [
          { name: "Text to speech", role: "Reads the question and the feedback aloud.", tech: "tts-1, voice fable" },
          { name: "Transcription", role: "Turns answer.wav into text.", tech: "whisper-1" },
          { name: "Feedback", role: "Judges the answer to the question in an interview context.", tech: "gpt-3.5-turbo" },
        ],
      },
      {
        name: "Output",
        blocks: [
          { name: "Speaker", role: "Plays question.mp3 and response.mp3.", tech: "playsound" },
        ],
      },
    ],
  },
  stages: [
    {
      date: "Hackathon",
      phase: "Problem",
      title: "Practice answers out loud, not in a text box",
      summary:
        "Computer science students prepare for interviews by typing answers, but interviews are spoken. The assistant makes the student answer by voice within a time limit, then gives feedback.",
      points: [
        "Built by a team of 3, per the repo README.",
        "The question bank mixes background, behavioural and motivation questions.",
      ],
    },
    {
      date: "Hackathon",
      phase: "Architecture",
      title: "One question, five API calls",
      summary: "Each round is a fixed pipeline. Audio files on disk pass data between the steps.",
      tables: [
        {
          caption: "One interview round (AI_test.py)",
          head: ["Step", "Tool", "Detail"],
          rows: [
            ["Pick", "random.choice", "One question from the bank, removed once asked"],
            ["Ask", "OpenAI tts-1, voice 'fable'", "question.mp3, played with playsound"],
            ["Record", "PyAudio", "16-bit mono at 44,100 Hz for a fixed time per question, saved as answer.wav"],
            ["Transcribe", "OpenAI whisper-1", "answer.wav to text"],
            ["Judge", "gpt-3.5-turbo", "Prompt: give feedback on this answer to this question, in an interview context"],
            ["Reply", "OpenAI tts-1, voice 'fable'", "response.mp3, played back"],
          ],
        },
      ],
      calcs: [
        {
          title: "Recording buffer and length",
          given: ["Sample rate 44,100 Hz", "Chunk = 0.03 s of audio", "Timer for a tier 0 question = 8 s"],
          steps: [
            "Chunk size = int(0.03 × 44,100) = 1,323 frames",
            "Chunks per second = 44,100 / 1,323 = 33.3",
            "Chunks to read = int(33.3 × 8) = 266",
            "Recorded time = 266 × 1,323 / 44,100 = 7.98 s",
          ],
          result: "An 8 s answer window, read in 30 ms chunks.",
          source: "AI_test.py (Recorder)",
        },
      ],
    },
    {
      date: "Hackathon",
      phase: "Question bank",
      title: "Harder questions get more time",
      summary: "Each question carries a tier from 0 to 3. The tier sets how long the student has to answer.",
      tables: [
        {
          caption: "Answer time by tier (14 questions)",
          head: ["Tier", "Time", "Questions", "Example"],
          rows: [
            ["0", "8 s", "3", "What is your major weakness?"],
            ["1", "10 s", "3", "Describe yourself in three words."],
            ["2", "15 s", "5", "Why do you want to work here?"],
            ["3", "20 s", "3", "Tell me about one time you failed, and what did you learn from it?"],
          ],
        },
      ],
      stats: [
        { value: "14", label: "questions in the bank" },
        { value: "2", label: "questions per session" },
        { value: "8 to 20 s", label: "answer window" },
      ],
    },
    {
      date: "Hackathon",
      phase: "Decisions",
      title: "Two loops in one repo",
      summary:
        "AI_model.py is a second, always-listening voice loop with memory and logging. Its system prompt is a doctor's intake assistant. Comparing the two shows which pieces the interview script left out.",
      iterations: [
        {
          name: "Local Whisper with pause detection",
          summary: "AI_model.py runs Whisper locally (tiny to large) on a mic thread, with an energy threshold of 300 and a 0.8 s pause to end an answer.",
          verdict: "revised",
          reason: "The interview script uses a fixed timer per question and the whisper-1 API, which needs no local model.",
        },
        {
          name: "ElevenLabs voice",
          summary: "AI_model.py speaks with the 'Bella' voice on eleven_multilingual_v1.",
          verdict: "dropped",
          reason: "The interview script and draft.py use OpenAI tts-1 with the 'fable' voice, the same provider as transcription and chat.",
        },
        {
          name: "Full chat history",
          summary: "AI_model.py sends the whole conversation to GPT-3.5 at temperature 0, so it remembers earlier answers.",
          verdict: "revised",
          reason: "The interview script sends one prompt per answer. Each question is judged on its own.",
        },
        {
          name: "MongoDB log with a relevance filter",
          summary: "A Keras text classifier (10,000-word vocabulary, 250-token inputs, 16-dim embedding, 10 epochs) decides which replies to store in MongoDB.",
          verdict: "dropped",
          reason: "Not used in the interview script. Answers stay in a Python list for the session.",
        },
        {
          name: "English or French",
          summary: "The script asks for a language at start.",
          verdict: "revised",
          reason: "The choice is stored but marked 'to finalize'. Questions and feedback stay in English.",
        },
      ],
    },
  ],
  sources: [
    "Virtual_interviewing_assistant repo: AI_test.py, AI_model.py, draft.py, README.md",
    "Repo git log: files uploaded Nov. 22, 2024, README Feb. 24, 2025, API key moved to an environment variable May 18, 2026",
    "Local copy in Hackathons/Marihacks",
  ],
};

export default dive;
