// react and react router imports
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Upload from '../components/Upload';

// library imports
import { v4 as uuidv4 } from "uuid";

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
    const [fileDataFlag, setFileDataFlag] = useState<number>(0);

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


    // To check user login status - Import files processed in last 30 mins
    // This useEffect is also triggered when any file is uploaded
    useEffect(() => {
        // runs once when the component is rendered
        // This function fetches data from the backend about uploaded files, namely their file name and id.
        // We can look into providing links for those files
        const fetchUploadData = async () => {
            // fetching file name data from backend
            // Should also run when we upload a new file @@@
            // @@@
            // setFileData(fetchFileNames());
            try {
                const data = await fetchFileNames();
                setFileData(data?.data);
                // console.log("files: ", data.data);
                console.log("filedata: ", fileData);
            } catch (err) {
                console.error("Error fetching file names.", err);
            }

        }

        fetchUploadData();

        // Might not be working
        fetchUserData().then((res) => {
            if (res.message === "User details retrieved successfully") {
                setuserStatus(true);
            }
        })
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
                            <Upload />
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
                {
                    seconds && seconds == -1 ? (
                        <div className="sortlabels__columnFlex">
                            <text className="sortlabels__durationText">Previously uploaded files...</text>
                            <ul className="sortlabels__filesList">
                                {
                                    fileData && fileData.data.map((fileName: String, index) => {
                                        return (
                                            <li className="sortlabels__fileItem"
                                                key={index}>
                                                {fileName}
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




// const newData: uploadDataType[] = [{
            //     name: "Flipkart-101.pdf",
            //     id: "015a8cd6-112a-4628-a72c-b7b346f0d7a4"
            // }, {
            //     name: "Amazon-123.pdf",
            //     id: "015a8c14-112a-4628-a72c-b7b696f0d7a4"
            // }, {
            //     name: "Meesho-113.pdf",
            //     id: "015a8cd6-112a-4628-1s2c-b7b696f0d7a4"
            // }];
