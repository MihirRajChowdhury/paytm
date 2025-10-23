// backend/api/index.js
const express = require('express');
const userRouter = require("./user")
const accountRouter = require("./account")

const router = express.Router();

router.get("/user",userRouter);
router.get("/account",accountRouter)

module.exports = router;