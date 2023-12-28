import "./Home.css"
// import HomeImage from "../assets/HomeImage.png";
import labelsort_illus from "../assets/labelsort_illus.svg"
const Home = () => {
    return (
        <div className="home">
            <div className="home__TextContainer">
                <text className="home__TitleText">Sort and Crop E-commerce labels at one place</text>
                <text className="home__DescriptionText">Merge, group, sort the shipping labels in one click. Supports major platforms including amazon, flipkart and meesho.</text>
            </div>
            <img className="home__MainImage" src={labelsort_illus} alt="Home image" />
            
        </div>
    )
}

export default Home 