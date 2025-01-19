const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fileDeleteHandler = require("../utils/fileDelete");
const cloudinary = require("cloudinary").v2;

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

  try {
    let user;
    if (!isNaN(username)) {
      user = await User.findOne({ number: username });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const authToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // Consider adding expiry back in
    );

    const refreshToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "1d" } // Consider adding expiry back in
    );

    res.cookie("authtoken", refreshToken, {
      // maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res
      .status(200)
      .json({ success: true, message: "Login Successful", authToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
};

// Helper function to delete image from Cloudinary
// const deleteCloudinaryImage = async (imageUrl) => {
//   try {
//     if (!imageUrl) return;
//     // Extract public_id from Cloudinary URL
//     const public_id = imageUrl.split("/").slice(-1)[0].split(".")[0];
//     console.log(public_id);
//     await cloudinary.uploader.destroy("ChatifyData/profiles/" + public_id);
//   } catch (error) {
//     console.error("Failed to delete image from Cloudinary:", error);
//   }
// };

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      console.log("No image URL provided");
      return null;
    }

    // Extract the public_id from the URL
    const [image_id, extension] = imageUrl.split("/").slice(-1)[0].split(".");
    // console.log(`${image_id}.${extension}`);

    // Append folder path if applicable
    const fullPublicId = `ChatifyData/profiles/${image_id}.${extension}`;
    // console.log("Full public_id for deletion:", fullPublicId);

    // Perform the deletion
    const result = await cloudinary.uploader.destroy(fullPublicId);

    // Check and log result
    if (result.result === "ok") {
      console.log("Image successfully deleted");
      return true;
    } else {
      // console.log("Failed to delete image. Response:", result);
      return false;
    }
  } catch (error) {
    // console.error("Failed to delete image from Cloudinary:", error);
    return false; // Return false in case of any error
  }
};

exports.updateProfile = async (req, res) => {
  const { name, number, email, username } = req.body;

  try {
    const loginUser = req.user;

    // Only delete if there's a new image being uploaded
    if (req.file && loginUser.imageURL) {
      const isDeleted = await deleteCloudinaryImage(loginUser.imageURL);

      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Failed to delete old image from Cloudinary" });
      }
    }

    // Validate input
    if (!name || name.length < 3 || name.length > 20) {
      return res
        .status(400)
        .json({ message: "Name must be 3-20 characters long." });
    }

    if (!/^\d{10}$/.test(number)) {
      return res.status(400).json({ message: "Phone number Invalid" });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        number,
        email: email || "",
        username,
        imageURL: req.file ? req.file.path : loginUser.imageURL,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
