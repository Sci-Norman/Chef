
import chef from "../assets/chef.svg"; // Correct path
import "../index.css";

function Header({ darkMode, setDarkMode }) {
    return (
        <div className="total">
           <img className="image" src={chef} alt="chef icon" />
            <h2 className="heading">Millie's Kitchen</h2>
            <button 
                className="dark-mode-toggle" 
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
            >
                {darkMode ? '☀️' : '🌙'}
            </button>
        </div>
    );
}

export default Header;
