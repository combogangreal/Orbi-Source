const express = require("express");
const router = express.Router();
const { User } = require("../models/users");

router.post("/", async (req, res) => {
    try {
        const results = await User.find({}).exec()
        const data = [];

        await results.forEach((result) => {
            data.push(result);
        });

        return res.status(200).json({ data });
    } catch (e) {
        console.log("Idk what tf is happening\n" + e);
        res.status(400).json({e})
    }
});

module.exports = router;