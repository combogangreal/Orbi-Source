const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authCheck");

// authCheck middleware
router.use(authCheck);

// Test authentication
router.post("/authcheck", (req, res) => {
    try {
        // Respond
        return res.status(200).json({
            message: "You are authorized to use this route!",
        });
    } catch (e) {
        console.log("Idk what tf is happening\n" + e);
    }
});

module.exports = router;
