const { User, Senior, Caregiver, Doctor, Admin } = require('../models/User');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  const { role } = req.body;

  const roleModels = {
    Senior,
    Caregiver,
    Doctor,
    Admin,
  };

  const Model = roleModels[role];

  if (!Model) {
    return res.status(400).json({ success: false, message: 'A valid user role must be provided.' });
  }

  try {
    // Create user using the specific model for the role
    const user = await Model.create(req.body);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Registration Error:', error);
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., email already exists)
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }
    res.status(400).json({ success: false, message: 'An error occurred during registration. Please try again.' });
  }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
};

// @desc      Get current logged in user
// @route     POST /api/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  // user is already available in req object from the protector middleware
  const user = req.user;
  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
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
