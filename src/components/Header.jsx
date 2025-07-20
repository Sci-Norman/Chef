
import chef from "../assets/chef.png"; // Correct path
import "../index.css";

function Header() {
    return (
        <div className="total">
           <img className="image" src={chef} alt="chef icon" />
            <h2 className="heading">Norman's Kitchen</h2>
        </div>
    );
}

export default Header;
