const express = require('express');
const controller =  require("./controller");
let router = express.Router();

router.post("/register", controller.createUser);
router.post("/login", controller.login);
router.post("/user/:pin", controller.verifyAuth, controller.sendText);
router.get("/user/:pin", controller.verifyAuth, controller.findUser);
router.get("/user/:pin/show", controller.verifyAuth, controller.showText);
router.post("/api/refresh", controller.refreshToken);


module.exports = router