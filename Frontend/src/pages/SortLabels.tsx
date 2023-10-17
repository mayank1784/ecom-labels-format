import { useParams } from "react-router";
import { propType } from "../helper/helperTypes";
import "./SortLabels.css";
import { useEffect, useState } from "react";
import { BiCloudUpload } from "react-icons/bi";

const SortLabels = () => {
    const [userStatus, setuserStatus] = useState<Boolean>(false);
    const features = ["Hi", "Hello", "Bye"];

    useEffect(() => {
        if (true) {
            setuserStatus(true);
        }
    }, [])

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
                            <span className="sortlabels__uploadButton">Upload Doc.</span>
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
                <text className="sortlabels__durationText"> Wait for...</text>
            </div>
        </div>
    )
}

export default SortLabels