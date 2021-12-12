const jwt = require('jsonwebtoken');

const generateToken = (userId, userLastName) => {
    const payload = { userId: userId, lastName: userLastName };
    const token = jwt.sign(payload, process.env.SECRET);
    return token;
};

// const tokenToCookie = (originalToken) => {
//     const half = Math.ceil(originalToken.length / 2);
//     const cookieToSend = originalToken.slice(0, half);
//     return cookieToSend;
// }

// const cookieToToken = (cookieToken) => {
//     const 
// }

const verifyAuth = (req, res, next) => {
    console.log('GETTIMG JERE')
    let token;
    if (req.headers.authorization !== undefined) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = req.cookies.auth;
    }

    if (!token) return res.status(401).json({ message: 'Access denied.' })

    const decoded = jwt.verify(token, process.env.SECRET, function (err, token) {
        if (err) return res.status(400).json({ message: 'Token is not valid' })
        return token
    });

    req.user = decoded;
    next();
}

module.exports = { generateToken, verifyAuth };