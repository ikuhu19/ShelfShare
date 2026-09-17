const express = require("express");

const router = express.Router();

const {
    sendRequest,
    getRequests,
    getSentRequests,
    updateRequestStatus,
    cancelRequest
} = require("../controllers/requestController");

router.post("/send", sendRequest);

router.get("/sent/:requester_id", getSentRequests);

router.get("/:owner_id", getRequests);

router.put("/:id", updateRequestStatus);

router.delete("/:id", cancelRequest);

module.exports = router;