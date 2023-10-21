// react and react router imports
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

// library imports
import { v4 as uuidv4 } from "uuid";
import { BiCloudUpload } from "react-icons/bi";

// Stylesheet and types
import { propType, uploadDataType } from "../helper/helperTypes";
import "./SortLabels.css";



const SortLabels = () => {

    // To check the user Login status
    const [userStatus, setuserStatus] = useState<Boolean>(false);
    const [fileData, setFileData] = useState<uploadDataType[]>();

    // To help with the functionality of countdown
    const [seconds, setSeconds] = useState<number>(-1);

    // To store id of setInterval entity
    const timerRef = useRef<any>();    // using any here @@@

    // Change the features here @@@
    const features = ["Hi", "Hello", "Bye"];

    // To help navigate to loading page with the pdf ID, for use there
    const navigate = useNavigate();

    // This id generation will be replaced by the ID given from the backend on proccessing
    const randomUUID = uuidv4();

    // Hooks 


    // To check user login status
    useEffect(() => {
        // runs once when the component is rendered
        fetchUploadData();
        if (true) {
            setuserStatus(true);
        }
    }, [])

    // To handle coundown functionality
    useEffect(() => {
        if (seconds == 5) {
            // Start counter when the button is clicked
            timerRef.current = setInterval(() => {
                setSeconds((prevSeconds: number) => {
                    if (prevSeconds === 1) {
                        clearInterval(timerRef.current);
                        // Setting this state to a flag value
                        setSeconds(-2);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        return () => {
            if (seconds == 0) {
                // Just for clarity, the one inside setInterval is exected 
                clearInterval(timerRef.current);
            }
        };
    }, [seconds])

    // This function fetches data from the backend about uploaded files, namely their file name and id.
    // We can look into providing links for those files
    const fetchUploadData = () => {
        // for now we will explicitly fill up the names and ID's into a variable.

        const newData: uploadDataType[] = [{
            name: "Flipkart-101.pdf",
            id: "015a8cd6-112a-4628-a72c-b7b346f0d7a4"
        }, {
            name: "Amazon-123.pdf",
            id: "015a8c14-112a-4628-a72c-b7b696f0d7a4"
        }, {
            name: "Meesho-113.pdf",
            id: "015a8cd6-112a-4628-1s2c-b7b696f0d7a4"
        }];

        setFileData(newData);

    }

    // Functionality to start countdown upto 5(visible) then change a state

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
                            features.map((feature: string) => {
                                return (
                                    <li className="sortlabels__feature">{feature}</li>
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
                            <BiCloudUpload className="sortlabels__uploadIcon" size="6rem" />
                            <span className="sortlabels__uploadButton" onClick={() => {
                                setSeconds(5)
                            }}>Upload Doc.</span>
                        </>
                    ) : (
                        <>
                            <text className="sortlabels__titleText"> Crop {type} Labels</text>
                            <text className="sortlabels__descriptionText">Crop and sort {type} PDF Labels in the order you want with the easiest {type} Label Crop tool available.</text>
                            <span className="sortlabels__signInButton">Register First</span>
                        </>
                    )
                }
                {/* Some nice free space is left here for potential visual additions */}
            </div>
            <hr />
            <div className="sortlabels__rightContent">
                {
                    seconds && seconds == -1 ? (
                        <div className="sortlabels__columnFlex">
                            <text className="sortlabels__durationText">Previously uploaded files...</text>
                            <ul className="sortlabels__filesList">
                                {
                                    fileData && fileData.map((fileDataObject: uploadDataType) => {
                                        return (
                                            <li className="sortlabels__fileItem">
                                                {fileDataObject.name}
                                                <br />
                                                {fileDataObject.id.slice(0, 8)}...
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    ) : seconds == -2 ? (
                        <>
                            <text className="sortlabels__durationText"> Your Link is almost ready</text>
                            <span className="sortlabels__linkSpan" onClick={() => navigate(`/loading/${randomUUID}`)}>link here</span>
                            {/* Thinking about passing props in the link with the pdf ID */}
                        </>
                    ) : (
                        <text className="sortlabels__durationText"> Wait for... {seconds}</text>
                    )
                }
                {

                }
            </div>
        </div>
    )
}

export default SortLabels