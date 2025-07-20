import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function ChefRecipe({ recipe }) {
    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Norman's Kitchen Recommends:</h2>
            <ReactMarkdown
                children={recipe}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            />
        </section>
    );
}
