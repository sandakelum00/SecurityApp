const User = require("../Models/User.js");
const { generateOtp, mailTransport } = require("../Utils/Mail.js");
const {
  EmailTemplate,
  SuccessEmailTemplate,
} = require("../utils/EmailTemplate.js");
const Verification = require("../Models/Verification.js");
const bcrypt = require("bcryptjs");

const addUser = async (req, res, next) => {
  try {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password || !role) {
      res.status(400).json({ message: "Please provide all values" });
      throw new Error("Please provide all values");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      res.status(400).json({ message: "Email is already exists" });
      throw new Error("Email is already exists");
    }

    const OTP = generateOtp();

    const user = new User({
      userName: userName,
      email: email,
      password: OTP,
      role: role,
    });

    await user.save();
    const token = user.createJWT();

    const verification = new Verification({
      createdBy: user._id,
    });

    await verification.save();

    mailTransport().sendMail({
      from: process.env.MAILTRAP_USER,
      to: user.email,
      subject: "Verify your email account",
      html: EmailTemplate(OTP, user.userName, user._id),
    });

    user.password = undefined;
    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
      throw new Error("Invalid Credentials");
    }

    if (user.verify) {
      res.status(401).json({ message: "This account is already verified" });
      throw new Error("This account is already verified");
    }

    const verifyUser = await Verification.findOne({ createdBy: user._id });
    if (!verifyUser) {
      res.status(401).json({ message: "Sorry! user not found" });
      throw new Error("Sorry! user not found");
    }

    user.verify = true;
    await Verification.findByIdAndDelete(verifyUser._id);
    await user.save();

    res
      .status(200)
      .json({ verify: user.verify, message: "Verification successfully" });

    mailTransport().sendMail({
      from: process.env.MAILTRAP_USER,
      to: user.email,
      subject: "Verify successfully",
      html: SuccessEmailTemplate(user.userName),
    });
  } catch (error) {
    throw new Error(error);
  }
};

const resetUser = async (req, res, next) => {
  try {
    const { id, userName, tempPassword, newPassword, confirmPassword } =
      req.body;

    if (!id || !userName || !tempPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ message: "Please provide all values" });
      throw new Error("Please provide all values");
    }

    const userDetails = await User.findOne({ _id: id }).select("+password");
    if (!userDetails) {
      res.status(404).json({ message: `No user with id :${id}` });
      throw new Error(`No user with id :${id}`);
    }

    if (confirmPassword != newPassword) {
      res.status(400).json({ message: "Password is mismatch" });
      throw new Error("Password is mismatch");
    }

    const isTempPassCorrect = await userDetails.comparePassword(tempPassword);
    if (!isTempPassCorrect) {
      res.status(400).json({ message: "Invalid temporary password" });
      throw new Error("Invalid temporary password");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    const updateUser = {
      userName: userName,
      status: true,
      password: password,
    };

    const user = await User.findOneAndUpdate({ _id: id }, updateUser, {
      new: true,
      runValidators: true,
    });

    // await user.save();
    const token = user.createJWT();

    res.status(200).json({ user, token });
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ message: "Please provide all values" });
      throw new Error("Please provide all values");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
      throw new Error("Invalid Credentials");
    }

    if (user.role != role || !user.verify || !user.status) {
      res.status(401).json({ message: "Invalid Account Type" });
      throw new Error("Invalid Account Type");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid Credentials" });
      throw new Error("Invalid Credentials");
    }

    const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user, token });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { addUser, verifyEmail, login, resetUser };
