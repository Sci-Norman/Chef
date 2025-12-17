import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are a culinary assistant that receives a list of ingredients and suggests a recipe using some or all of them. Keep extras minimal. At the end, recommend a YouTube video with an iframe embed. Format in markdown.
`;

const hfAccessToken = import.meta.env.VITE_HF_ACCESS_TOKEN;
if (!hfAccessToken) {
  throw new Error("HuggingFace access token is missing. Please set VITE_HF_ACCESS_TOKEN in your .env file.");
}

const hf = new HfInference(hfAccessToken);

/**
 * Chat-style GPT function
 * Uses a chat-ready model like Zephyr
 */
export async function getRecipeChat(ingredientsArr, retries = 3) {
  const ingredientsString = ingredientsArr.join(", ");
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await hf.chatCompletion({
        model: "HuggingFaceH4/zephyr-7b-beta", // ✅ chat-ready model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `I have ${ingredientsString}. Please give me a recipe!` },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.response?.data || err.message);
      if (attempt === retries) {
        return "Error: Could not generate recipe after multiple attempts. Check your access token, model availability, or network.";
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export async function getRecipeText(ingredientsArr, retries = 3) {
  const ingredientsString = ingredientsArr.join(", ");
  const prompt = `${SYSTEM_PROMPT}\n\nI have ${ingredientsString}. Please give me a recipe!`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await hf.textGeneration({
        model: "tiiuae/falcon-40b-instruct", // ✅ supported text-generation model
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
        },
      });

      return response.generated_text;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.response?.data || err.message);
      if (attempt === retries) {
        return "Error: Could not generate recipe after multiple attempts. Check your access token, model availability, or network.";
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
