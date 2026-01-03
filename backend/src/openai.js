import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // 🔥 THIS LINE FIXES THE ERROR

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
