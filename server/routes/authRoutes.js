import express from "express";
import {
  register,
  accountActivation,
  signin,
} from "../controllers/authControllers.js";
import {
  userSignupValidator,
  userSigninValidator,
} from "../validators/authValidators.js";
import runValidation from "../validators/index.js";

const router = express.Router();

router.route("/signup").post(userSignupValidator, runValidation, register);
router.route("/account-activation").post(accountActivation);
router.route("/signin").post(userSigninValidator, runValidation, signin);

export default router;
