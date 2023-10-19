import { useParams } from "react-router";
import { propType } from "../helper/helperTypes";
import "./SortLabels.css";
import { useEffect, useRef, useState } from "react";
import { BiCloudUpload } from "react-icons/bi";

const SortLabels = () => {
    const [userStatus, setuserStatus] = useState<Boolean>(false);
    const [seconds, setSeconds] = useState<number>(6);
    const timerRef = useRef<any>();    // using any here @@@
    const features = ["Hi", "Hello", "Bye"];

    // To check user login status
    useEffect(() => {
        if (true) {
            setuserStatus(true);
        }
    }, [])

    // To handle coundown functionality
    useEffect(() => {
        if (seconds == 5) {
            timerRef.current = setInterval(() => setSeconds((prevSeconds: number) => prevSeconds - 1), 1000);
        } else if (seconds == 1) {
            // when countdown hits zero
            clearInterval(timerRef.current);
            // Setting this state to a flag value
            setSeconds(10);
        }

        if (seconds)

            return () => {
                clearInterval(timerRef.current);
            };
    }, [seconds])

    // Functionality to start countdown upto 5(visible) then change a state

    const { type } = useParams<propType>();
    console.log(userStatus);
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
                                setSeconds(seconds - 1)
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
                    seconds == 10 ? (
                        <text className="sortlabels__durationText"> Wait for... {seconds}</text>

                    ) : (
                        <>
                            <text className="sortlabels__durationText"> Your Link is almost ready</text>
                            <span className="sortlabels__linkSpan">link here</span>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default SortLabels