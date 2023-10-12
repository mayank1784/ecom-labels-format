// import { BiChevronDown } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import Logo from "../assets/websiteLogo.png";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className='nav'>
            <img className="nav__logoImage" src={Logo} alt="Company logo" onClick={() => { navigate("/") }} />
            <text className="nav__logInText" onClick={() => { navigate("/login") }}>Log In</text>
            <text className="nav_registerText" onClick={() => { navigate("/register") }}>Register</text>
            <text className="nav__pricingText">Pricing</text>
            <text className="nav__toolsDropdown">Amazon</text>
            <text className="nav__toolsDropdown">Meesho</text>
            <text className="nav__toolsDropdown">Flipkart</text>
            {/* All the good stuff to be present here text */}
        </div>
    )
}

export default Navbar 