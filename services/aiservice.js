import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.`,
});

export const generateResult = async (prompt) => {
  try {
    
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt. A non-empty string is required.");
    }

    const result = await model.generateContent(prompt);

    return result?.response?.text?.() || "No content generated.";
  } catch (error) {
    console.error("Error in generateResult:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });

    if (error.status === 500 || error.status === 503) {
      throw new Error("The service is temporarily unavailable. Please try again later.");
    } else if (error.status === 400) {
      throw new Error("Invalid request. Please check your prompt and try again.");
    } else {
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};
