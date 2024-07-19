import express from "express";
import { getGroupMessage, getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/user/:id").get(isAuthenticated, getMessage);
router.route("/group/:id").post(isAuthenticated, getGroupMessage);

export default router;