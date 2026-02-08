import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function ChefRecipe({ recipe }) {
    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Norman's Kitchen Recommends:</h2>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    iframe: ({ node, ...props }) => (
                        <iframe
                            {...props}
                            style={{
                                maxWidth: "100%",
                                border: "none",
                                borderRadius: "8px",
                                marginTop: "1rem",
                            }}
                        />
                    ),
                }}
            >
                {recipe}
            </ReactMarkdown>
        </section>
    );
}