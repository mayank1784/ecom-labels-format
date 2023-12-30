import "./Home.css"
// import HomeImage from "../assets/HomeImage.png";
import labelsort_illus from "../assets/labelsort_illus.svg"
import labelsorters from "../assets/labelsorters.webp"
import uploadlabels from "../assets/uploadlabels.webp"
import sortedlabels from '../assets/sortedlabels.webp'
const Home = () => {
    return (
        <>
        <div className="home">
            <div className="home__TextContainer">
                <text className="home__TitleText">Sort and Crop E-commerce labels at one place</text>
                <text className="home__DescriptionText">Merge, group, sort the shipping labels in one click. Supports major platforms including amazon, flipkart and meesho.</text>
            </div>
            <img className="home__MainImage" src={labelsort_illus} alt="Home image" />
        </div>
        <div className="howItWorks">
            <h2>How It Works ?</h2>
                   <div className="image-container">
                   <div className="image-wrapper">
                     <img src={uploadlabels} alt="Image 1" />
                   </div>
                   <div className="arrow-line"></div>
                   <div className="image-wrapper">
                     <img src={labelsorters} alt="Image 2" />
                     
                   </div>
                   <div className="arrow-line"></div>
                   <div className="image-wrapper">
                     <img src={sortedlabels} alt="Image 3" />
                   </div>
                 </div>
                 <div className="imageText">
                   <p>Download The Amazon/ Flipkart / Meesho PDF Labels.</p>
                   <p>Upload on Label Sorters and let the magic happen</p>
                   <p>Download the sorted and cropped labels</p>
                 </div>
                 </div>
                 </>
    )
}

export default Home 