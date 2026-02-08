export default function IngredientsList(props) {
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient.id}>
            {ingredient.name}
            <button 
                className="remove-ingredient-btn" 
                onClick={() => props.removeIngredient(ingredient.id)}
                aria-label={`Remove ${ingredient.name}`}
            >
                ✕
            </button>
        </li>
    ))
    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {props.ingredients.length > 1 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.getRecipe}>Get a recipe</button>
            </div>}
        </section>
    )
}