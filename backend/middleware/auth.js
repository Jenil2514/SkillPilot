import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

const auth = async (req, res, next) => {
    const rawToken = req.header('Authorization');
    const token = rawToken && rawToken.startsWith('Bearer ') ? rawToken.split(' ')[1] : null;

    // console.log("Raw token:", rawToken);
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.id).select('-password');

        // if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = decoded.id // now req.user includes full user object
        next();
    } 
    catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default auth;
