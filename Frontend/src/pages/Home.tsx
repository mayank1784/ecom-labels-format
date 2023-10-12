import "./Home.css"
import HomeImage from "../assets/HomeImage1.png";
const Home = () => {
    return (
        <div className="home">
            <div className="home__TextContainer">
                <text className="home__TitleText">Sort and Crop Your Ecommerce Labels with one click.</text>
                <text className="home__DescriptionText">Merge, group, sort the shipping labels in one click. Supports major platforms including amazon, flipkart and meesho.</text>
            </div>
            <img className="home__MainImage" src={HomeImage} alt="Home image" />
        </div>
    )
}

export default Home 