const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
       const error = new Error('Not authenticated.');
       error.statusCode = 401;
       throw error;   
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    
    try {
        decodedToken = jwt.verify(token, 'secretKey');
        
    } catch (err) {
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    // req.userId = "63b9c7cf58c119a8ae1451f8";
    next()

}