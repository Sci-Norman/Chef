import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChefRecipe({
  recipe,
  onGetAnother,
  rating,
  isFavorite,
  onRatingChange,
  onFavoriteToggle,
}) {
  const [copyConfirmation, setCopyConfirmation] = React.useState("");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recipe);
      setCopyConfirmation("Copied!");
      setTimeout(() => setCopyConfirmation(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async function handleShare() {
    try {
      const plainText = recipe.replace(/[#*_~`[\]()]/g, "").replace(/\n\n+/g, "\n\n");

      const shareText = `🍳 Recipe from Norman's Kitchen\n\n${plainText}\n\nGenerated with Norman's Kitchen AI Chef`;
      await navigator.clipboard.writeText(shareText);
      setCopyConfirmation("Shared to clipboard!");
      setTimeout(() => setCopyConfirmation(""), 2000);
    } catch (err) {
      console.error("Failed to share:", err);
    }
  }

  function handleStarClick(starRating) {
    onRatingChange(starRating);
  }

  return (
    <section className="suggested-recipe-container" aria-live="polite">
      <h2>Norman's Kitchen Recommends:</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe}</ReactMarkdown>

      <div className="recipe-actions">
        <button className="action-btn" onClick={handleCopy}>
          Copy
        </button>
        <button className="action-btn" onClick={handleShare}>
          Share
        </button>
        <button className="action-btn" onClick={onGetAnother}>
          Get Another Recipe
        </button>
        {copyConfirmation && <span className="copy-confirmation">{copyConfirmation}</span>}
      </div>

      <div className="recipe-rating">
        <span>Rate this recipe:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="star-button"
            onClick={() => handleStarClick(star)}
            aria-label={`Rate ${star} stars`}
            type="button"
          >
            {star <= rating ? "⭐" : "☆"}
          </button>
        ))}
        <button className="favorite-btn" onClick={onFavoriteToggle} aria-label="Toggle favorite" type="button">
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </section>
  );
}
