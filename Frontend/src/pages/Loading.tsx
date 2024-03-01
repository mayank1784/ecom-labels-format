import { useParams } from "react-router"
import { propTypeTwo } from "../helper/helperTypes";
import { useEffect, useRef, useState } from "react";


const Loading = () => {
    const [seconds, setSeconds] = useState<number>(6);
    const timeRef = useRef<any>();
    const { id } = useParams<propTypeTwo>();

    useEffect(() => {
        if (seconds == 5) {
            timeRef.current = setInterval(() => {
                setSeconds((prevSeconds: number) => {
                    if (prevSeconds === 1) {
                        clearInterval(timeRef.current);
                        setSeconds(-2);
                        return 0;
                    }
                    return prevSeconds - 1;
                })
            }, 1000)
        }
        return () => {
            if (seconds == 0) {
                // Just for clarity, the one inside setInterval is exected 
                clearInterval(timeRef.current);
            }
        };
    }, [seconds])

    return (
        <div className="loading">
            {
                seconds && seconds == 6 ? (
                    <text className="loading__contentText" onClick={() => { setSeconds(seconds - 1) }} style={{ cursor: "pointer" }}>
                        Click to proceed
                    </text>
                ) : seconds == -2 ? (
                    <text className="loading__contentText">
                        Your pdf with ID:
                        <span className="loading__boldSpan">
                            {id}
                        </span>
                        ... is ready for download!
                        <br />
                        <br />
                        Click the link below
                    </text>
                ) : (
                    <text className="loading__contentText">
                        Almost there...
                        <span className="loading__boldSpan">
                            {seconds}
                        </span>
                    </text>
                )
            }
            {/* ID, not visible here */}
        </div>
    )
}

export default Loading