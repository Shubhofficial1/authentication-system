import User from "../models/userModel.js";
import sendEmailWithNodemailer from "../helpers/email.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        error: "Email is Taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const emailData = {
      from: process.env.NODEMAILER_GMAIL_EMAIL,
      to: email,
      subject: "ACCOUNT ACTIVATION LINK",
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sendEmailWithNodemailer(req, res, emailData);
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      error: err,
    });
  }
};

const accountActivation = async (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION_SECRET, (err, d) => {
      if (err) {
        console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Expired Link,SignUp Again",
        });
      }
    });

    const { name, email, password } = jwt.decode(token);

    const user = new User({ name, email, password });
    const savedUser = await user.save();

    if (!savedUser) {
      console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR");
      return res.status(401).json({
        error: "Error saving user in database, try signing up again",
      });
    }

    return res.status(200).json({ message: "Signup Success, Please SignIn" });
  } else {
    return res
      .status(200)
      .json({ message: "Something Went Wrong , please try again" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      error: "User with that email does not exist, Please try singup first.",
    });
  }

  if (!user.authenticate(password)) {
    return res.status(400).json({
      error: "Email & Password do not match.",
    });
  }

  // Generate a token

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const { _id, name, email: userEmail, role } = user;

  return res.json({
    token,
    user: {
      _id,
      name,
      email: userEmail,
      role,
    },
  });
};

export { register, accountActivation, signin };
