const express = require("express");
const router = express.Router();
const os = require("os");

router.get("/ping", async (req, res) => {
    res.status(200).json({
        message: "The Orbi API is up!",
        systemInfo: {
            platform: os.platform(),
            uptime: os.uptime(),
            freeMem: os.freemem(),
            totalMem: os.totalmem(),
            cpuCount: os.cpus().length
        }
    });
});

module.exports = router;
