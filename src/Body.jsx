import React from "react";
import ChefRecipe from "./components/ChefRecipe";
import RecipeHistory from "./components/RecipeHistory";
import { getRecipeChat } from "./ai.js";

const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Gluten-free", "Low-carb", "Dairy-free", "Nut-free"];
const CUISINE_OPTIONS = ["Any", "Italian", "Asian", "Mexican", "Indian", "Mediterranean", "American", "French", "Surprise me!"];

function readRecipeHistory() {
  try {
    const saved = localStorage.getItem("chef-recipe-history");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Body() {
  const [ingredients, setIngredients] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [dietaryPreferences, setDietaryPreferences] = React.useState([]);
  const [cuisineType, setCuisineType] = React.useState("Any");
  const [recipeHistory, setRecipeHistory] = React.useState(readRecipeHistory);
  const [currentRecipeId, setCurrentRecipeId] = React.useState(null);
  const recipeRef = React.useRef(null);
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    localStorage.setItem("chef-recipe-history", JSON.stringify(recipeHistory));
  }, [recipeHistory]);

  React.useEffect(() => {
    if (recipe && !loading && recipeRef.current) {
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (isMobile) {
        setTimeout(() => {
          recipeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [recipe, loading]);

  async function getRecipe() {
    const activeRequestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const ingredientNames = ingredients.map((ing) => ing.name);
      const recipeMarkdown = await getRecipeChat(ingredientNames, {
        dietaryPreferences,
        cuisineType,
      });

      if (activeRequestId !== requestIdRef.current) {
        return;
      }

      setRecipe(recipeMarkdown);

      const newRecipeId = crypto.randomUUID();
      const newHistoryItem = {
        id: newRecipeId,
        recipe: recipeMarkdown,
        ingredients: ingredientNames,
        dietaryPreferences,
        cuisineType,
        timestamp: Date.now(),
        rating: 0,
        isFavorite: false,
      };
      setRecipeHistory((prev) => [...prev, newHistoryItem]);
      setCurrentRecipeId(newRecipeId);
    } catch (err) {
      if (activeRequestId !== requestIdRef.current) {
        return;
      }

      console.error("Recipe generation failed:", err);
      setRecipe("Error: Could not generate recipe. Please try again.");
    } finally {
      if (activeRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newIngredient = inputValue.trim();
    if (newIngredient) {
      setIngredients((prevIngredients) => [...prevIngredients, { id: crypto.randomUUID(), name: newIngredient }]);
      setInputValue("");
    }
  }

  function removeIngredient(id) {
    setIngredients((prevIngredients) => prevIngredients.filter((ingredient) => ingredient.id !== id));
  }

  function toggleDietaryPreference(pref) {
    setDietaryPreferences((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]));
  }

  function updateRecipeRating(rating) {
    if (!currentRecipeId) return;
    setRecipeHistory((prev) => prev.map((item) => (item.id === currentRecipeId ? { ...item, rating } : item)));
  }

  function toggleRecipeFavorite() {
    if (!currentRecipeId) return;
    setRecipeHistory((prev) =>
      prev.map((item) => (item.id === currentRecipeId ? { ...item, isFavorite: !item.isFavorite } : item)),
    );
  }

  function selectHistoryRecipe(historyItem) {
    setRecipe(historyItem.recipe);
    setCurrentRecipeId(historyItem.id);
  }

  function clearHistory() {
    if (window.confirm("Are you sure you want to clear all recipe history?")) {
      setRecipeHistory([]);
      setRecipe("");
      setCurrentRecipeId(null);
    }
  }

  function clearRecipe() {
    setRecipe("");
    setCurrentRecipeId(null);
  }

  const currentRecipe = recipeHistory.find((item) => item.id === currentRecipeId);

  return (
    <main className={`unified-container ${recipe ? "has-recipe" : ""}`}>
      <div className="dashboard-section">
        <div className="dashboard-content">
          <div className="dashboard-card hero-card">
            <h1 className="dashboard-title">Welcome to Norman&apos;s Kitchen</h1>
            <p className="dashboard-subtitle">Let&apos;s cook something amazing together!</p>

            <form onSubmit={handleSubmit} className="dashboard-form">
              <div className="form-group">
                <label htmlFor="ingredient-input">What ingredients do you have?</label>
                <div className="input-with-button">
                  <input
                    id="ingredient-input"
                    className="dashboard-input"
                    type="text"
                    name="ingredient"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., chicken, rice, tomatoes..."
                    aria-label="Add ingredient"
                  />
                  <button className="button add-btn" type="submit">
                    <span className="btn-icon">+</span> Add
                  </button>
                </div>
              </div>
            </form>

            {ingredients.length > 0 ? (
              <div className="ingredients-chips-container">
                <h3>Your Ingredients ({ingredients.length})</h3>
                <div className="ingredients-chips">
                  {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="ingredient-chip">
                      <span>{ingredient.name}</span>
                      <button
                        className="chip-remove"
                        onClick={() => removeIngredient(ingredient.id)}
                        aria-label={`Remove ${ingredient.name}`}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🥗</span>
                <p>Start by adding ingredients above</p>
              </div>
            )}

            <div className="preferences-row">
              <div className="preference-section">
                <h3>Dietary Preferences</h3>
                <div className="dietary-chips">
                  {DIETARY_OPTIONS.map((pref) => (
                    <button
                      key={pref}
                      className={`dietary-chip ${dietaryPreferences.includes(pref) ? "active" : ""}`}
                      onClick={() => toggleDietaryPreference(pref)}
                      type="button"
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div className="preference-section">
                <h3>Cuisine Style</h3>
                <select className="cuisine-select" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)}>
                  {CUISINE_OPTIONS.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {ingredients.length > 1 && (
              <div className="generate-recipe-section">
                <button className="button generate-btn" onClick={getRecipe} disabled={loading} type="button">
                  {loading ? (
                    <>
                      <span className="cooking-animation">👨‍🍳</span> Cooking up something delicious...
                    </>
                  ) : (
                    <>Generate Recipe</>
                  )}
                </button>
              </div>
            )}
          </div>

          {recipeHistory.length > 0 && (
            <div className="dashboard-card history-card">
              <h2 className="section-title">Recipe History</h2>
              <RecipeHistory history={recipeHistory} onSelectRecipe={selectHistoryRecipe} onClearHistory={clearHistory} />
            </div>
          )}
        </div>
      </div>

      {(recipe || loading) && (
        <div className="recipe-section" ref={recipeRef}>
          {loading && (
            <div className="spinner-container" aria-live="polite">
              <div className="cooking-spinner">
                <span className="cooking-emoji">👨‍🍳</span>
                <span className="cooking-emoji">🥘</span>
                <span className="cooking-emoji">🔥</span>
              </div>
              <span className="loading-text">Crafting your perfect recipe...</span>
            </div>
          )}

          {recipe && !loading && (
            <>
              <button className="back-to-full-view-btn" onClick={clearRecipe} type="button">
                Back to full view
              </button>
              <ChefRecipe
                recipe={recipe}
                onGetAnother={getRecipe}
                rating={currentRecipe?.rating || 0}
                isFavorite={currentRecipe?.isFavorite || false}
                onRatingChange={updateRecipeRating}
                onFavoriteToggle={toggleRecipeFavorite}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}
