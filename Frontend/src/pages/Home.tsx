import "./Home.css"
import HomeImage from "../assets/HomeImage.png";
const Home = () => {
    return (
        <div className="home">
            <div className="home__TextContainer">
                <text className="home__TitleText">Title Text here</text>
                <text className="home__DescriptionText">Description to be added here..</text>
            </div>
            <img className="home__MainImage" src={HomeImage} alt="Home image" />
        </div>
    )
}

export default Home 