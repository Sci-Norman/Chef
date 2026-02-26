import React from "react";
import Header from "./components/Header";
import "./index.css";
import Body from "./Body";

export default function App() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem("chef-dark-mode");
    return saved === "true";
  });

  React.useEffect(() => {
    localStorage.setItem("chef-dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div data-theme={darkMode ? "dark" : "light"}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Body />
    </div>
  );
}
