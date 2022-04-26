const User = require("../models/orders.model");
const cache = require("../utils/cache");
const jwtConfig = require("../config/jwt");
const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");
const db = require("../models");

exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  console.log("hashedpassword===", hashedPassword);
  req.body.password = hashedPassword;
  const userdata = await db.orders.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (userdata) {
    res.json({
      status: 404,
      message: "user already exits",
    });
  }
  
  let user = await db.orders.create({
    ...req.body,
  });
  user = JSON.parse(JSON.stringify(user));
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  res.json(user);
};

exports.login = async (req, res) => {
  const user = await db.orders.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    const isMatched = await bcrypt.compare(req.body.password, user.password);

    if (isMatched) {
      const token = await jwt.createToken({ id: user.id });
      return res.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: jwtConfig.ttl,
      });
    }
  }
  return res.status(401).json({ error: "Unauthorized" });
};

exports.getUser = async (req, res) => {
  let user = await db.orders.findByPk(req.user.id);
  user = JSON.parse(JSON.stringify(user));
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  console.log(user);
  return res.json(user);
};

exports.logout = async (req, res) => {
  const token = req.token;
  const now = new Date();
  const expire = new Date(req.user.exp);
  const milliseconds = now.getTime() - expire.getTime();
  /* ----------------------------- BlackList Token ---------------------------- */
  await cache.set(token, token, milliseconds);

  return res.json({ message: "Logged out successfully" });
};
