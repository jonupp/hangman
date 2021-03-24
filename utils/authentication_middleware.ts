import jwt from "jsonwebtoken";

function authentication_middleware(req, res, next){
    let token = req.cookies.jwt_token;
    try{
        let decoded = jwt.verify(token, process.env.SECRET);
        req.player_id = decoded.player_id;
        next();
    }catch(err){
        res.redirect("/login");
    }

}

export {authentication_middleware};