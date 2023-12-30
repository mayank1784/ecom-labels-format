import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar";
import "../stylesheets/App.css";
import wave from "../assets/Footer.png";
import Footer from "../components/Footer"

const Main = () => {
    return (
        <div className="main">
            <Navbar />
            <main>
                <Outlet />
            </main>
            {/* <div className="main__waveSvg">
                <img src={wave} alt="" />
            </div> */}
            <Footer/>
        </div>
    )
}

export default Main