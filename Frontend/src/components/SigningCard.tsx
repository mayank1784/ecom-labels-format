import "./SigningCard.css";
import Logo from "../assets/websiteLogo.png";
import { BsGoogle } from "react-icons/bs"
import { propType } from "../helper/helperTypes";
import { useEffect, useState } from "react";
import { fetchUserData, signInGoogle } from "../helper/helperFunc";
import { useNavigate } from "react-router";


const SigningCard = ({ type }: propType) => {

    const [pageType, setPageType] = useState<String>("");
    const navigate = useNavigate();

    useEffect(() => {
        if (type == "register") {
            setPageType("Register")
        } else if (type == "login") {
            setPageType("Sign in")
        }
    }, [])

    const googleButtonHandler = async () => {
        await signInGoogle();
        console.log("Google function done")
        navigate(-1);
        // console.log(fetchUserData());
    }

    // console.log(type);
    return (
        <div className="SigningCard">
            <div className="SigningCard__container">
                <span>
                    {pageType}
                </span>
                <img className="SigningCard__logo" src={Logo} alt="" width={"200px"} height={"200px"} />
                <div className="SigningCard__button" onClick={googleButtonHandler}>
                    <BsGoogle className="SigningCard__googleLogo" size="16px" />
                    Continue with google</div>
                <hr />
                <text className="SigningCard__fillerText">Check our <a href="/Error">Terms & conditions</a> with Info on our data security features.</text>
            </div>
        </div>
    )
}

export default SigningCard