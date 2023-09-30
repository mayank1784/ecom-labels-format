const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

exports.authorize = async(req,res,next)=>{
    // const token = 
    const sessionToken = req.headers['authorization'];
    if(!sessionToken)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    jwt.verify(sessionToken, process.env.JWT_SECRET, (err,decoded)=>{
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
          }
      
          // Attach the user object to the request for further processing
          console.log("session token: ", sessionToken);
          req.user = decoded.user;
          next();
    });
}
