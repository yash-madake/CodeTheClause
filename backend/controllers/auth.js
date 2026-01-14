const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, phone, pin, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      phone,
      pin,
      role,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { phone, pin, role, seniorId } = req.body;

    // Validate phone & pin
    if (!phone || !pin) {
      return res.status(400).json({ success: false, msg: 'Please provide a phone and pin' });
    }

    // Check for user
    const user = await User.findOne({ phone, role }).select('+pin');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    // Check if pin matches
    const isMatch = await user.matchPin(pin);

    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    if (role === 'doctor' || role === 'caretaker') {
      if (!seniorId) {
        return res.status(400).json({ success: false, msg: 'Please provide a seniorId' });
      }
      const senior = await User.findOne({ seniorId: seniorId });
      if (!senior) {
        return res.status(401).json({ success: false, msg: 'Invalid seniorId' });
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
