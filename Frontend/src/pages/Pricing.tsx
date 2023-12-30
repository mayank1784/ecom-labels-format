/* eslint-disable @typescript-eslint/no-namespace */
// import PriceCard from "../components/PriceCard"
// import "../components/PriceCard.css"
// const Pricing = () => {
//     return (
//         <div className="pricing">
//             <div className="pricing__cardContainer">
//                 {/* Card style to be imported here, with the plan name & its price */}
//                 <PriceCard plan="Basic" cost="1.99" big="false" />
//                 <PriceCard plan="Premium" cost="11.99" big="true" />
//                 <PriceCard plan="Pro" cost="4.99" big="false" />
//             </div>
//         </div>
//     )
// }

// export default Pricing 
import {React, useEffect} from 'react';
// If using TypeScript, add the following snippet to your file as well.
declare global {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
  }
  

function Pricing() {
    useEffect(()=>{
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
            document.body.removeChild(script);
        }
      }, []);
        
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1OSfMCSH7BCCbs7PGbClrrbN"
      publishable-key="pk_test_51NKlz9SH7BCCbs7P2rqP8XfaaFdfjg8IdKXYHbzm2zmvTx5fHnj5GsxpYEamOvCWFrs48AhM6chFNYPusN9VIQFx00onVt64Pf"
    >
    </stripe-pricing-table>
  );
}

export default Pricing;