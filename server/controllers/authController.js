const User = require('../models/User');
const { setCookieAndRespond } = require('../middleware/auth');

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

    const user = await User.create({ name, email, password, provider: 'local' });
    return setCookieAndRespond(res, user);
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'No account found with that email' });
    if (!user.password) return res.status(401).json({ message: 'Please sign in with your social account' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Incorrect password' });

    return setCookieAndRespond(res, user);
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
}

// POST /api/auth/logout
function logout(req, res) {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).json({ message: 'Logged out successfully' });
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user: user.toSafeObject() });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, logout, getMe };
