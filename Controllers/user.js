const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  try {
    const { username, password, name, number } = req.body;
    //check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { number }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Account already created with this number" });
    }

    //Hashing the password
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 8);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    // console.log(username, password);
    const user = await User.create({
      username,
      password: hashPassword,
      name,
      number,
    });
    // console.log(user);

    res.status(200).json({ user, login: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({
        available: false,
        message: "",
      });
    }

    // Regex for partial match
    if (username.length >= 3) {
      const regex = new RegExp(username, "i"); // 'i' for case-insensitive matching
      const existingUser = await User.findOne({ username: regex });
      if (existingUser) {
        return res
          .status(400)
          .json({ available: false, message: "Username is unavailable" });
      }

      res
        .status(200)
        .json({ available: true, message: "Username is available" });
    } else {
      return res.status(400).json({
        available: false,
        message: "Username 3 - 20 characters",
      });
    }
  } catch (err) {
    console.error("Error checking username:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.postLogin = async (req, res, next) => {
  const { username, password } = req.body;

  let user;
  try {
    if (!isNaN(username)) {
      user = await User.findOne({ number: username });
    } else {
      user = await User.findOne({ username });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal server error", error: error });
  }

  // console.log(user);

  try {
    if (!username) {
      return res.status(200).json({ message: "User not exists" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  try {
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Invaild email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }

  const authToken = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.JWT_SECRET_KEY
    // {
    //   expiresIn: "1h",
    // }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.JWT_REFRESH_TOKEN
    // {
    //   expiresIn: "1d",
    // }
  );

  res.cookie("authtoken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res
    .status(200)
    .json({ success: true, message: "Login Successful", authToken });
};
