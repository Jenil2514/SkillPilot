import User from "../models/User.js";
const admin = async (req, res, next) => {
  try {

    const userId = req.user; // already decoded in auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(userId).select('role'); // only select role for efficiency

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default admin;
