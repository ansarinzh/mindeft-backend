const express = require("express");
const { Registration, verifyEmail, Login, resetPassLink, resetPassword } = require("../Controllers/UserController");
const router = express.Router();

router.post('/registration', Registration);
router.get("/verify/:id/:token",verifyEmail);
router.post('/login', Login);
router.post('/resetLink', resetPassLink);
router.post('/resetPassword',resetPassword)


module.exports = router;