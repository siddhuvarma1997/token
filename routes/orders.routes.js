module.exports = (app) => {
  const authController = require("../controllers/orders.controller");
  const authGuard = require("../middlerware/auth.guard");
  const validate = require("../utils/validator");
  const router = require("express").Router();
  router.post("/register", validate("register"), authController.register);
  router.post("/login", validate("login"), authController.login);
  router.get("/user", authGuard, authController.getUser);
  router.get("/logout", authGuard, authController.logout);
  app.use("/api", router);
};
