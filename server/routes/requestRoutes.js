const express = require("express");

const router = express.Router();

const {
    sendRequest,
    getRequests,
    updateRequestStatus
} = require("../controllers/requestController");

router.post("/send", sendRequest);

router.get("/:owner_id", getRequests);

router.put("/:id", updateRequestStatus);

module.exports = router;