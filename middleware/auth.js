import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token — please login first'
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();

  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid token — please login again'
    });
  }
};

export default protect;