const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  avatar:   { type: String, default: '' },

  googleId:   { type: String, default: null },
  facebookId: { type: String, default: null },
  twitterId:  { type: String, default: null },
  provider:   { type: String, enum: ['local', 'google', 'facebook', 'twitter'], default: 'local' },

  savedCategories: { type: [String], default: [] },
  bookmarks:       { type: [mongoose.Schema.Types.ObjectId], ref: 'Article', default: [] },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);