// import { BiChevronDown } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import Logo from "../assets/websiteLogo.png";
import "./Navbar.css"
import { fetchUserData } from "../helper/helperFunc";
import { useState } from "react";

const Navbar = () => {

    // Setting states
    const [userName, setUserName] = useState<string>("");
    const [userAvatar, setUserAvatar] = useState<string>("");

    const navigate = useNavigate();
    // const userName: string = fetchUserData()?.data.displayName;
    fetchUserData().then((res: any) => {   // Using any here   @@@
        if (res.data.message == "User details retrieved successfully.") {
            // console.log(res.data.data.displayName, res.data.data.photoURL)
            setUserName(res.data.data.displayName);
            setUserAvatar(res.data.data.photoURL);
        }
    })
    return (
        <div className='nav'>
            <img className="nav__logoImage" src={Logo} alt="Company logo" onClick={() => { navigate("/") }} />
            <span className="nav__companyText" onClick={() => { navigate("/") }}>Label Sorters</span>
            {
                userName == "" ? (
                    <>
                        <text className="nav__logInText" onClick={() => { navigate("/login") }}>Log In</text>
                        <text className="nav_registerText" onClick={() => { navigate("/register") }}>Register</text>
                    </>
                ) : (
                    <>
                        <img className="nav__logoImage" style={{ position: "relative", borderRadius: "50%", marginRight: "20px", marginLeft: "0px", height: "6vh", left: "0px" }} src={userAvatar} alt="Avatar Picture" />
                        <text className="nav_registerText" style={{ textDecoration: "underline" }}>{userName}</text>
                    </>
                )
            }
            <text className="nav__pricingText" onClick={() => { navigate("/pricing") }}>Pricing</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("/sortlabels/Amazon") }}>Amazon</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("sortlabels/Meesho") }}>Meesho</text>
            <text className="nav__toolsDropdown" onClick={() => { navigate("sortlabels/Flipkart") }}>Flipkart</text>
            {/* All the good stuff to be present here text */}
        </div>
    )
}

export default Navbar 