import { Router } from "express";
import * as userControllers from "../controllers/user.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

import { body } from "express-validator";

const router = Router();

router.post(
  "/register",
  body(`email`).isEmail().withMessage("Email must be valid"),
  body(`password`)
    .isLength({ min: 3 })
    .withMessage("Password must be atleast 3 characters long"),
  userControllers.createUserController
);

router.post(
  "/login",
  body(`email`).isEmail().withMessage("Email must be valid"),
  body(`password`)
    .isLength({ min: 3 })
    .withMessage("Password must be atleast 3 characters long"),
  userControllers.loginController
);

router.get(
  "/profile",
  authMiddleware.authUser,
  userControllers.profileController
);

router.get(
  "/logout",
  authMiddleware.authUser,
  userControllers.logoutController
);

router.get(
  "/all",
  authMiddleware.authUser,
  userControllers.getAllUsersController
);

router.get("/user/current", (req, res) => {
  if (req.user && req.user.email) {
    res.json({ email: req.user.email });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});
export default router;
