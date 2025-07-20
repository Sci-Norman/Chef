import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `
You are a culinary assistant that receives a list of ingredients and suggests a recipe using some or all of them. You may include additional common ingredients if needed, but keep extras minimal.Also, at the end, recommend a youtube video in relation to that cooking. Format the youtube video that it displays a video on the app not a link. Format your response in markdown for easy rendering on a web page. 
`;

const hfAccessToken = import.meta.env.VITE_HF_ACCESS_TOKEN;
if (!hfAccessToken) {
    throw new Error("HuggingFace access token is missing. Please set VITE_HF_ACCESS_TOKEN in your .env file.");
}

const hf = new HfInference(hfAccessToken, { provider: "together" });

export async function getRecipeFromMistral(ingredientsArr, retries = 3) {
    const ingredientsString = ingredientsArr.join(", ");
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await hf.chatCompletion({
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
                ],
                max_tokens: 1024,
                temperature: 0.7, // Add temperature for controlled creativity
            });
            return response.choices[0].message.content;
        } catch (err) {
            console.error(`Attempt ${attempt} failed:`, err);
            if (attempt === retries) {
                return "Error: Could not generate recipe after multiple attempts. Check your access token, model availability, or network.";
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}