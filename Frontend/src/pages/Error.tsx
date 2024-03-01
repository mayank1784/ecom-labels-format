import { useRouteError } from "react-router-dom";
import "../stylesheets/Error.css"

type propType = {
    screen: string;
}
const Error = ({ screen }: propType) => {
    const error: any = useRouteError();
    return (
        <div className='error'>
            <h2 className="error__title">There was an error at: {screen}</h2>
            <p className="error__message">{error.message || error.statusText}</p>
        </div>
    )
}

export default Error