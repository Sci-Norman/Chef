import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are a culinary assistant that receives a list of ingredients and suggests a recipe using some or all of them. Keep extras minimal. Format the recipe in markdown.

IMPORTANT: Do NOT include any YouTube links, iframe embeds, or video URLs. Instead, at the end of your recipe, suggest a YouTube search term the user can look up themselves, formatted like this:

**🎥 YouTube Search Suggestion:** Search for "[recipe name] recipe tutorial" on YouTube for a video walkthrough.
`;

const hfAccessToken = import.meta.env.VITE_HF_ACCESS_TOKEN;
if (!hfAccessToken) {
  console.error("HuggingFace access token is missing. Please set VITE_HF_ACCESS_TOKEN in your .env file.");
}

const hf = hfAccessToken ? new HfInference(hfAccessToken) : null;

/**
 * Chat-style function
 * Uses Qwen2.5-7B-Instruct — currently active on HF free inference
 */
export async function getRecipeChat(ingredientsArr, options = {}, retries = 3) {
  if (!hf) {
    return "Error: HuggingFace access token is missing. Please set VITE_HF_ACCESS_TOKEN in your .env file.";
  }
  
  const { dietaryPreferences = [], cuisineType = 'Any' } = options;
  const ingredientsString = ingredientsArr.join(", ");
  
  let userMessage = `I have ${ingredientsString}. Please give me a recipe!`;
  
  if (dietaryPreferences.length > 0) {
    userMessage += ` Dietary preferences: ${dietaryPreferences.join(', ')}.`;
  }
  
  if (cuisineType && cuisineType !== 'Any') {
    userMessage += ` Cuisine style: ${cuisineType}.`;
  }
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
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
        model: "Qwen/Qwen2.5-7B-Instruct",
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