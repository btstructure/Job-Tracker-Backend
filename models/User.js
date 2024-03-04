const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Application = require('./Application')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  jobApplications: [Application.schema], //since its an array of job applications
});

//hashing the password

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};


const User = mongoose.model("User", userSchema);

module.exports = User;
