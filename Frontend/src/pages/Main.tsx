import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar";
import "../stylesheets/App.css";
import wave from "../assets/wave.svg";

const Main = () => {
    return (
        <div className="main">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <div className="main__waveSvg">
                <img src={wave} alt="" />
            </div>
        </div>
    )
}

export default Main