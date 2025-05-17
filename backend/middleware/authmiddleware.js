const jwt = require('jsonwebtoken');

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        const token = authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message: 'autharization token missing'});
        }

        try{
            const decoded = jwt.verify(token, 'b7c4a1e6f9d385b2a8e1c7f0a3d9e5b8c2a6f1e9d4c7b3a8e2c5f0a1d9e3b8c');
            req.userId = decoded.userId;
            next();
        }catch(error){
            return res.status(401).json({message: 'invalid authorization token'});
        }
    }else{
        return res.status(401).json({message: 'Authorization header missing or invalid format'});
    }
};
module.exports = authmiddleware;
