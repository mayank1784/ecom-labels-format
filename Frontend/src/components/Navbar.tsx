// import { BiChevronDown } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import Logo from "../assets/websiteLogo.png";
import "./Navbar.css"

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className='nav'>
            <img className="nav__logoImage" src={Logo} alt="Company logo" onClick={() => { navigate("/") }} />
            <span className="nav__companyText" onClick={() => { navigate("/") }}>Label Sorters</span>
            <text className="nav__logInText" onClick={() => { navigate("/login") }}>Log In</text>
            <text className="nav_registerText" onClick={() => { navigate("/register") }}>Register</text>
            <text className="nav__pricingText" onClick={() => { navigate("/pricing") }}>Pricing</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("/sortlabels/Amazon") }}>Amazon</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("sortlabels/Meesho") }}>Meesho</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("sortlabels/Flipkart") }}>Flipkart</text>
            {/* All the good stuff to be present here text */}
        </div>
    )
}

export default Navbar 