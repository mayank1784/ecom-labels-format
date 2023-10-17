import PriceCard from "../components/PriceCard"
import "../components/PriceCard.css"
const Pricing = () => {
    return (
        <div className="pricing">
            <div className="pricing__cardContainer">
                {/* Card style to be imported here, with the plan name & its price */}
                <PriceCard plan="Basic" cost="1.99" big="false" />
                <PriceCard plan="Premium" cost="11.99" big="true" />
                <PriceCard plan="Pro" cost="4.99" big="false" />
            </div>
        </div>
    )
}

export default Pricing 