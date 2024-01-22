// node --version # Should be >= 18
// npm install @google/generative-ai


import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold, } from "@google/generative-ai"

const MODEL_NAME = "gemini-pro";
const API_KEY = import.meta.env.RAKKAS_GEMINI_API_KEY;

export async function generateTypeORMTypeGrapQLClass(input:string) {
  try {
    if(!API_KEY) throw new Error("Missing API_KEY");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      {
        text: `Given the typescript interface 
        ${input}
        generate typescript class with TypeORM and Type-GraphQL annotations 
        make sure it's only one class per interface ,
         also ensure every unique interface gets its own class 
         with with TypeORM and Type-GraphQL annotations 
         you are forbidden from using markdown syntax in the response
         `,
      },
    ];
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    console.log(
        "====== generateTypeORMTypeGrapQLClass response ======",
      response,JSON.stringify(response)
      );
    const response_text = response.text();
      console.log(
          "====== generateTypeORMTypeGrapQLClass response text ======",
          response_text
      );
    return response_text;
  } catch (error) {
    console.log("====== generateTypeORMTypeGrapQLClass error ======", error);
    throw error;
  }
}

// run();
