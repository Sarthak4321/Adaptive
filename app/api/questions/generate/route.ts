import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, difficulty, count = 3 } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in environment variables" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Generate ${count} multiple-choice questions for an adaptive learning platform.
      Topic: ${topic}
      Difficulty: ${difficulty}
      
      Requirements:
      1. Each question must have exactly 4 options.
      2. Exactly one option must be correct.
      3. Return ONLY a valid JSON array of objects with this structure:
         [
           {
             "text": "Question text here?",
             "options": ["Option A", "Option B", "Option C", "Option D"],
             "correctAnswer": "The exact string of the correct option",
             "difficulty": "${difficulty}"
           }
         ]
      4. Ensure the content is professional and accurate.
      5. Do not include any markdown formatting like \`\`\`json or explanation text. Just the raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up potential markdown formatting if Gemini includes it despite instructions
    if (text.startsWith("```json")) {
      text = text.replace(/```json|```/g, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/```/g, "").trim();
    }

    try {
      const questions = JSON.parse(text);
      return NextResponse.json(questions);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { error: "AI generated invalid JSON format. Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
