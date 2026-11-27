import type { TechDive } from "./types";

/** Built from the LazyCare repo, the earlier lazycare-template1 repo, the Bot_Training Tools folder, and both git logs. */
const dive: TechDive = {
  heading: "How LazyCare runs a small health model behind a web app",
  intro:
    "LazyCare is a health chat assistant built at UdeMHacks in March 2025. A Next.js app talks to an Express server, which calls a Python FastAPI service running TinyLlama 1.1B. Two repos record the work: a first template from Mar. 4 to 8, and the final app from Mar. 8 to 9.",
  stages: [
    {
      date: "Mar. 4 to 7, 2025",
      phase: "Problem",
      title: "Short, practical health advice in a chat",
      summary:
        "The assistant answers health questions in plain language. The system prompt asks for supportive, non-judgmental wording and the top three practical suggestions.",
      points: [
        "A user signs in, keeps a profile, and sees past chats.",
        "Chat history is stored per email address, so a user can delete their own data.",
        "The first template repo built the login, profile, chat and delete-data screens.",
      ],
    },
    {
      date: "Mar. 8, 2025",
      phase: "Architecture",
      title: "Three services on three ports",
      summary: "Each layer does one job. The browser never talks to the model directly.",
      tables: [
        {
          caption: "Request path for one chat message",
          head: ["Layer", "Port", "Code", "Job"],
          rows: [
            ["Next.js frontend", "3000", "app/chat, app/profile, library/chatApi.ts", "Firebase Google sign-in, chat UI, profile"],
            ["Express server", "5000", "server.js, chatbot.service.js", "/user and /chat routes, CORS for localhost:3000"],
            ["FastAPI service", "8000", "tinyllama_api.py", "POST /tinyllama-generate, rejects empty input with 400"],
            ["Storage", "none", "src/data/historicalchats.json, users.json", "JSON files read and written by the Express server"],
          ],
        },
      ],
      calcs: [
        {
          title: "Generation settings",
          given: ["Model TinyLlama/TinyLlama-1.1B-Chat-v1.0, bfloat16, device_map auto"],
          steps: [
            "Prompt = chat template(system prompt + user message)",
            "Sample with max_new_tokens = 256, temperature = 0.7",
            "Keep only the text after the last <|assistant|> tag",
          ],
          result: "One reply of up to 256 new tokens per message.",
          source: "backend/tinyllama_api.py",
        },
      ],
    },
    {
      date: "Mar. 5 to 9, 2025",
      phase: "Model choice",
      title: "From Llama 2 to TinyLlama",
      summary: "The model changed twice before anything answered in the app. Each change moved to a smaller model.",
      iterations: [
        {
          name: "Llama 2 through Ollama",
          summary: "A Modelfile: FROM llama2, a friendly health-assistant system prompt, temperature 0.7.",
          verdict: "dropped",
          reason: "A system prompt alone does not add medical knowledge. The work moved to fine-tuning in Python.",
        },
        {
          name: "Fine-tune Llama 2 in Python",
          summary: "fine_tune_llama2.py in the template repo.",
          verdict: "dropped",
          reason: "The last commit on Mar. 8 at 03:23 stops at a RuntimeError: the model had modules offloaded to CPU or disk and could not be moved.",
        },
        {
          name: "TinyLlama 1.1B Chat",
          summary: "Connected at 23:09 on Mar. 8 without fine-tuning, wired to the chat page at 05:21 on Mar. 9.",
          verdict: "kept",
          reason: "It was the first model to answer inside the app. The 05:21 commit notes the chat worked but profile saving did not yet.",
        },
        {
          name: "SQLAlchemy health profile schema",
          summary: "Health_Model.py drafted users and health profiles with conditions, allergies and medications as JSON columns.",
          verdict: "dropped",
          reason: "The app stores users and chats in JSON files through the Express server instead.",
        },
      ],
    },
    {
      date: "Mar. 9, 2025",
      phase: "Fine-tuning",
      title: "Fine-tuning on medical Q&A",
      summary:
        "The training script formats question and answer pairs from an iCliniq medical Q&A file into TinyLlama's chat format, then trains with the Hugging Face Trainer.",
      tables: [
        {
          caption: "Training setup (Bot_training_code/testing.py)",
          head: ["Setting", "Value"],
          rows: [
            ["Dataset", "icliniq_medical_qa_cleaned.csv, 39,540 rows (Title, Question, Answer)"],
            ["Rows used", "first 100, to keep training short"],
            ["Format", "<|user|> question <|assistant|> answer"],
            ["Epochs", "3"],
            ["Learning rate", "1e-5, weight decay 0.01"],
            ["Batch", "4 per device × 4 gradient accumulation = 16"],
            ["Precision", "fp16"],
            ["Saved model", "22 layers, hidden size 2048, 4.4 GB of float32 weights"],
          ],
        },
      ],
      points: [
        "The training log folder holds 9 test runs of prompts on sleep, depression, diet and fever, with the model's answers.",
        "The served API in the repo still loads the base TinyLlama model. The fine-tuned weights were tested with a separate prompt script.",
      ],
    },
    {
      date: "Mar. 9, 2025",
      phase: "Shipped",
      title: "Profile, chat and history",
      summary:
        "The final app has a login page, a profile page, an AI chat page, an AI analysis page, and a modal that deletes a user's data.",
      stats: [
        { value: "1.1B", label: "model parameters" },
        { value: "256", label: "max new tokens per reply" },
        { value: "3", label: "services: Next.js, Express, FastAPI" },
      ],
    },
  ],
  sources: [
    "LazyCare repo: README.md, backend/server.js, src/services/chatbot.service.js and db.service.js, tinyllama_api.py, frontend/library/firebase.ts",
    "LazyCare/backend/Bot_training_code: testing.py and prompt_testing.py",
    "lazycare-template1 repo git log (Mar. 4 to 8, 2025)",
    "UdemHacks/Backend: Modelfile and Health_Model.py",
    "Bot_Training Tools: Bot_Trained/config.json, Database/icliniq_medical_qa_cleaned.csv, Training log/Test_1 to Test_9",
    "LazyCare git log (Mar. 8 to 9, 2025)",
  ],
};

export default dive;
