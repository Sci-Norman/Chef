import React from "react";

export default function RecipeHistory({ history, onSelectRecipe, onClearHistory }) {
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true);

  const filteredHistory = showFavoritesOnly ? history.filter((item) => item.isFavorite) : history;
  const sortedHistory = [...filteredHistory].reverse();

  return (
    <div className="recipe-history">
      <h3>
        Recipe History
        <button className="toggle-history-btn" onClick={() => setIsExpanded(!isExpanded)} type="button">
          {isExpanded ? "Hide" : "Show"}
        </button>
      </h3>
      {isExpanded && (
        <>
          <div className="history-controls">
            <button
              className={`action-btn ${showFavoritesOnly ? "" : "secondary"}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              type="button"
            >
              {showFavoritesOnly ? "Show All" : "Favorites Only"}
            </button>
            {history.length > 0 && (
              <button className="action-btn secondary" onClick={onClearHistory} type="button">
                Clear History
              </button>
            )}
          </div>
          {sortedHistory.length === 0 ? (
            <p style={{ textAlign: "center", color: "#757575" }}>
              {showFavoritesOnly ? "No favorites yet" : "No recipes yet"}
            </p>
          ) : (
            <ul className="history-list">
              {sortedHistory.map((item) => (
                <li key={item.id}>
                  <button className="history-item" onClick={() => onSelectRecipe(item)} type="button">
                    <div className="history-item-header">
                      <strong>
                        {item.ingredients.slice(0, 3).join(", ")}
                        {item.ingredients.length > 3 ? "..." : ""}
                      </strong>
                      <span className="history-item-rating">
                        {item.isFavorite && "❤️ "}
                        {item.rating > 0 && `${"⭐".repeat(item.rating)}`}
                      </span>
                    </div>
                    <div className="history-item-meta">
                      {item.cuisineType && item.cuisineType !== "Any" && `${item.cuisineType} • `}
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
