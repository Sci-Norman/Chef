import React from "react";
import IngredientsList from "./components/IngredientsList";
import ChefRecipe from "./components/ChefRecipe";
import RecipeHistory from "./components/RecipeHistory";
// ✅ Import the correct function from ai.js
import { getRecipeChat } from "./ai.js";  

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Low-carb', 'Dairy-free', 'Nut-free'];
const CUISINE_OPTIONS = ['Any', 'Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 'American', 'French', 'Surprise me!'];

export default function Body() {
  const [ingredients, setIngredients] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [dietaryPreferences, setDietaryPreferences] = React.useState([]);
  const [cuisineType, setCuisineType] = React.useState('Any');
  const [recipeHistory, setRecipeHistory] = React.useState(() => {
    const saved = localStorage.getItem('chef-recipe-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRecipeId, setCurrentRecipeId] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem('chef-recipe-history', JSON.stringify(recipeHistory));
  }, [recipeHistory]);

  async function getRecipe() {
    setLoading(true);
    try {
      // ✅ Call the correct function, passing only ingredient names
      const ingredientNames = ingredients.map(ing => ing.name);
      const recipeMarkdown = await getRecipeChat(ingredientNames, { 
        dietaryPreferences, 
        cuisineType 
      });
      setRecipe(recipeMarkdown);
      
      // Save to history
      const newRecipeId = crypto.randomUUID();
      const newHistoryItem = {
        id: newRecipeId,
        recipe: recipeMarkdown,
        ingredients: ingredientNames,
        dietaryPreferences,
        cuisineType,
        timestamp: Date.now(),
        rating: 0,
        isFavorite: false
      };
      setRecipeHistory(prev => [...prev, newHistoryItem]);
      setCurrentRecipeId(newRecipeId);
    } catch (err) {
      console.error("Recipe generation failed:", err);
      setRecipe("Error: Could not generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newIngredient = inputValue.trim();
    if (newIngredient) {
      setIngredients(prevIngredients => [...prevIngredients, { id: crypto.randomUUID(), name: newIngredient }]);
      setInputValue("");
    }
  }

  function removeIngredient(id) {
    setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
  }

  function toggleDietaryPreference(pref) {
    setDietaryPreferences(prev => 
      prev.includes(pref) 
        ? prev.filter(p => p !== pref) 
        : [...prev, pref]
    );
  }

  function updateRecipeRating(rating) {
    if (!currentRecipeId) return;
    setRecipeHistory(prev => prev.map(item => 
      item.id === currentRecipeId ? { ...item, rating } : item
    ));
  }

  function toggleRecipeFavorite() {
    if (!currentRecipeId) return;
    setRecipeHistory(prev => prev.map(item => 
      item.id === currentRecipeId ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  }

  function selectHistoryRecipe(historyItem) {
    setRecipe(historyItem.recipe);
    setCurrentRecipeId(historyItem.id);
  }

  function clearHistory() {
    if (window.confirm('Are you sure you want to clear all recipe history?')) {
      setRecipeHistory([]);
      setRecipe("");
      setCurrentRecipeId(null);
    }
  }

  const currentRecipe = recipeHistory.find(item => item.id === currentRecipeId);

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
        
        <IngredientsList 
          ingredients={ingredients} 
          getRecipe={getRecipe} 
          removeIngredient={removeIngredient} 
        />

        <div className="dietary-preferences">
          <h3>Dietary Preferences</h3>
          <div className="dietary-chips">
            {DIETARY_OPTIONS.map(pref => (
              <button
                key={pref}
                className={`dietary-chip ${dietaryPreferences.includes(pref) ? 'active' : ''}`}
                onClick={() => toggleDietaryPreference(pref)}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div className="cuisine-selector">
          <h3>Cuisine Style</h3>
          <select 
            value={cuisineType} 
            onChange={(e) => setCuisineType(e.target.value)}
          >
            {CUISINE_OPTIONS.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="spinner-container" aria-live="polite">
            <div className="spinner"></div>
            <span>Generating recipe...⏳</span>
          </div>
        )}

        <RecipeHistory 
          history={recipeHistory}
          onSelectRecipe={selectHistoryRecipe}
          onClearHistory={clearHistory}
        />
      </div>
      <div className="right-pane">
        {recipe && !loading && (
          <ChefRecipe 
            recipe={recipe} 
            onGetAnother={getRecipe}
            rating={currentRecipe?.rating || 0}
            isFavorite={currentRecipe?.isFavorite || false}
            onRatingChange={updateRecipeRating}
            onFavoriteToggle={toggleRecipeFavorite}
          />
        )}
      </div>
    </main>
  );
}
