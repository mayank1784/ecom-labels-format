// react and react router imports
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Upload from '../components/Upload';

// Stylesheet and types
import { pdfNameDataType, propType } from "../helper/helperTypes";
import "./SortLabels.css";
import { fetchFileNames, fetchUserData } from "../helper/helperFunc";
import { Link } from "react-router-dom";



const SortLabels = () => {

    // To check the user Login status
    const [userStatus, setuserStatus] = useState<Boolean>(false);
    const [fileData, setFileData] = useState<pdfNameDataType>();
    // This useState has chance to be redundant
    const [showFileName, setShowFileName] = useState<Boolean>(true);

    // Change the features here @@@
    const features = ["Sorted by SKU and Qty", "Add SKU - QTY in Lable", "Remove extra blank pages", "Merge and process multiple labels"];

    // Hooks 

    // Run fetchUploadData after initial load and every minute
    useEffect(() => {
        fetchUploadData(); // Initial fetch after component render
        //     // Might not be working
        fetchUserData().then((res: any) => {   // Using any here   @@@
            // console.log("response from back",res.data.message);
            if (res.data.message == "User details retrieved successfully.") {
                console.log('user retrieved')
                setuserStatus(true);
            }
        })
        const interval = setInterval(() => {
            fetchUploadData(); // Fetch file names every minute
        }, 60000); // 60000 milliseconds = 1 minute

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    // Function to fetch file names
    const fetchUploadData = async () => {
        try {
            const data = await fetchFileNames();
            console.log(data, "inside fetchUploadData");
            setFileData(data?.data);
        } catch (err) {
            console.error("Error fetching file names.", err);
        }
    }

    // Callback function to be called after file upload completion
    const handleUploadCompletion = () => {
        setShowFileName(false);
        fetchUploadData(); // Fetch file names after upload completion 
        console.log('call complete')
        setShowFileName(true);
    };


    const { type } = useParams<propType>();
    return (
        <div className="sortlabels">
            <div className="sortlabels__leftContent">
                <div className="sortlabels__extraDiv">
                    Save a small region for buttons or other information
                </div>
                <div className="sortlabels__featuresDiv">
                    <text className="sortlabels__featuresTitle"> Features</text>
                    <ul className="sortlabels__featuresContainer">
                        {
                            features.map((feature: string, index) => {
                                return (
                                    <li className="sortlabels__feature"
                                        key={index}
                                    >{feature}</li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <hr />
            <div className="sortlabels__mainContent">
                {
                    userStatus == true ? (
                        <>
                            <text className="sortlabels__titleText"> Crop {type} Labels</text>
                            <text className="sortlabels__descriptionText">Crop and sort {type} PDF Labels in the order you want with the easiest {type} Label Crop tool available.</text>
                            <Upload onUploadCompletion={handleUploadCompletion} platform={type? type.toLowerCase(): ""}/>
                        </>
                    ) : (
                        <>
                            <text className="sortlabels__titleText"> Crop {type} Labels</text>
                            <text className="sortlabels__descriptionText">Crop and sort {type} PDF Labels in the order you want with the easiest {type} Label Crop tool available.</text>
                            <Link to="/register" className="sortlabels__signInButton">
                                {/* <span className="sortlabels__signInButton"> */}
                                Register First
                                {/* </span> */}
                            </Link>

                        </>
                    )
                }
                {/* Some nice free space is left here for potential visual additions */}
            </div>
            <hr />
            <div className="sortlabels__rightContent">
                <div className="sortlabels__columnFlex">
                    {showFileName ?
                        (<text className="sortlabels__durationText"> Your Files<br></br>(last 30 mins.) </text>)
                        :
                        (<text className="sortlabels__durationText">File Loading... </text>)
                    }
                    <ul className="sortlabels__filesList">
                        {
                            fileData && fileData.data.map((fileName: String, index) => {
                                return (
                                    <li className="sortlabels__fileItem"
                                        key={index}>
                                        <Link to={`/loading/${fileName.split("_").pop().split(".")[0].toLowerCase()}/${encodeURIComponent(fileName)}`}>{`${fileName.split('_')[2].slice(-4)}_merged_${fileName.split('_').pop()}`}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SortLabels