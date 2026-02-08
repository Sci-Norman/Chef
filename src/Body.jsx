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
  const [viewMode, setViewMode] = React.useState('dashboard'); // 'dashboard' or 'split'
  const recipeRef = React.useRef(null);

  React.useEffect(() => {
    localStorage.setItem('chef-recipe-history', JSON.stringify(recipeHistory));
  }, [recipeHistory]);

  // Auto-scroll to recipe on mobile after recipe generation
  React.useEffect(() => {
    if (recipe && !loading && recipeRef.current) {
      // Use matchMedia for proper responsive detection
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      if (isMobile) {
        setTimeout(() => {
          recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Small delay to ensure DOM is ready
      }
    }
  }, [recipe, loading]);

  async function getRecipe() {
    setLoading(true);
    setViewMode('split'); // Switch to split view when generating recipe
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
    setViewMode('split'); // Switch to split view when selecting a recipe
  }

  function clearHistory() {
    if (window.confirm('Are you sure you want to clear all recipe history?')) {
      setRecipeHistory([]);
      setRecipe("");
      setCurrentRecipeId(null);
      setViewMode('dashboard'); // Return to dashboard
    }
  }

  function backToDashboard() {
    setViewMode('dashboard');
    setRecipe("");
    setCurrentRecipeId(null);
  }

  const currentRecipe = recipeHistory.find(item => item.id === currentRecipeId);

  // Dashboard Mode: Full-width centered layout
  if (viewMode === 'dashboard') {
    return (
      <main className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-card hero-card">
            <h1 className="dashboard-title">🍳 Welcome to Norman's Kitchen</h1>
            <p className="dashboard-subtitle">Let's cook something amazing together!</p>
            
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
                    onChange={e => setInputValue(e.target.value)}
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
                  {ingredients.map(ingredient => (
                    <div key={ingredient.id} className="ingredient-chip">
                      <span>{ingredient.name}</span>
                      <button
                        className="chip-remove"
                        onClick={() => removeIngredient(ingredient.id)}
                        aria-label={`Remove ${ingredient.name}`}
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
                <h3>🥗 Dietary Preferences</h3>
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

              <div className="preference-section">
                <h3>🌍 Cuisine Style</h3>
                <select 
                  className="cuisine-select"
                  value={cuisineType} 
                  onChange={(e) => setCuisineType(e.target.value)}
                >
                  {CUISINE_OPTIONS.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
            </div>

            {ingredients.length > 1 && (
              <div className="generate-recipe-section">
                <button 
                  className="button generate-btn" 
                  onClick={getRecipe}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="cooking-animation">👨‍🍳</span> Cooking up something delicious...
                    </>
                  ) : (
                    <>
                      ✨ Generate Recipe
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {recipeHistory.length > 0 && (
            <div className="dashboard-card history-card">
              <h2 className="section-title">📖 Recipe History</h2>
              <RecipeHistory 
                history={recipeHistory}
                onSelectRecipe={selectHistoryRecipe}
                onClearHistory={clearHistory}
              />
            </div>
          )}

          {recipeHistory.length === 0 && (
            <div className="empty-state-card">
              <span className="empty-icon-large">🍽️</span>
              <h3>No recipes yet</h3>
              <p>Generate your first recipe to get started!</p>
            </div>
          )}
        </div>

        <footer className="dashboard-footer">
          Made with ❤️ by Norman's Kitchen
        </footer>
      </main>
    );
  }

  // Split View Mode: Traditional split pane with recipe
  return (
    <main className={`split-main ${viewMode === 'split' ? 'split-view-active' : ''}`}>
      <div className="left-pane">
        <button className="back-to-dashboard-btn" onClick={backToDashboard}>
          ← Back to Dashboard
        </button>

        <form onSubmit={handleSubmit} className="add-ingredient-form">
          <input
            className="input-box"
            type="text"
            name="ingredient"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Add more ingredients"
            aria-label="Add more ingredient"
          />
          <button className="button">Add</button>
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
            <div className="cooking-spinner">
              <span className="cooking-emoji">👨‍🍳</span>
              <span className="cooking-emoji">🥘</span>
              <span className="cooking-emoji">🔥</span>
            </div>
            <span className="loading-text">Crafting your perfect recipe...</span>
          </div>
        )}

        <RecipeHistory 
          history={recipeHistory}
          onSelectRecipe={selectHistoryRecipe}
          onClearHistory={clearHistory}
        />
      </div>
      <div className="right-pane" ref={recipeRef}>
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
