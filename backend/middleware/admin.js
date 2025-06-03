const admin = async (req, res, next) => {
  try {
    const user = req.user; // already decoded in auth middleware

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default admin;
