// routes/groupRoutes.js
import express from "express";
import { createGroup, getGroup, joinGroup } from "../controllers/groupController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createGroup);
router.route("/join").post(isAuthenticated, joinGroup);
router.route("/getgroup").post(isAuthenticated, getGroup);

export default router;
