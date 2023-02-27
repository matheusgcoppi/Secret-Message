const express = require('express');
const controller =  require("./controller");
let router = express.Router();

router.post("/register",  controller.createUser);
router.post("/login",  controller.login);

module.exports = router