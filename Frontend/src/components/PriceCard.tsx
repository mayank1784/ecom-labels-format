import { useEffect, useState } from "react";


const PriceCard = ({ plan, cost, big }: any) => {
    const [cardSize, setCardSize] = useState<string>("");
    useEffect(() => {
        if (big == "true") {
            setCardSize("44vh");
        }
        else {
            setCardSize("40vh");
        }
    }
        , [])
    return (
        <div className='pricecard' style={{ height: cardSize }}>
            {
                cost == "11.99" ? (
                    <span className="pricecard__planSubText">FOR BUISNESSES</span>

                ) : (
                    <span className="pricecard__planSubText">FOR INDIVIDUALS</span>
                )
            }
            <text className="pricecard__planText">{plan}</text>
            <text className="pricecard__priceText">
                {`$${cost}`}
                <span className="pricecard__priceSubText">/ month</span>
            </text>
            <span className="pricecard__button">Get Started</span>
            <div className="pricecard__benefitsList">
                <ul>
                    {/* change the below to accomodate different features for different plans */}
                    {

                    }
                    <li>Hi</li>
                    <li>Hello</li>
                    <li>Bye</li>
                </ul>
            </div>

        </div>
    )
}

export default PriceCard