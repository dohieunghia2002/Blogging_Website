import jwt from "jsonwebtoken";
import { errorResponse } from "../helpers/response.helper.js";


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json(errorResponse("accesstoken required", 401));
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).json(errorResponse("invalid or expired token", 403));
        }

        req.user = decoded; // decoded = { id, role, iat, exp }
        next();
    });
}

export default verifyToken;
