import React from "react";
import IngredientsList from "./components/IngredientsList";
import ChefRecipe from "./components/ChefRecipe";
import { getRecipeFromMistral } from "./ai.js";

export default function Body() {
    const [ingredients, setIngredients] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function getRecipe() {
        setLoading(true);
        const recipeMarkdown = await getRecipeFromMistral(ingredients);

        // No more video parsing — AI returns iframe directly
        setRecipe(recipeMarkdown);
        setLoading(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const newIngredient = inputValue.trim();
        if (newIngredient) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
            setInputValue("");
        }
    }

    return (
        <main className="split-main">
            <div className="left-pane">
                <form onSubmit={handleSubmit} className="add-ingredient-form">
                    <input
                        className="input-box"
                        type="text"
                        name="ingredient"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Add more than one ingredient"
                        aria-label="Add more than one ingredient"
                    />
                    <button className="button">Add ingredient</button>
                </form>
                <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
                {loading && (
                    <div className="spinner-container" aria-live="polite">
                        <div className="spinner"></div>
                        <span>Generating recipe...⏳</span>
                    </div>
                )}
            </div>
            <div className="right-pane">
                {recipe && !loading && <ChefRecipe recipe={recipe} />}
            </div>
        </main>
    );
}
