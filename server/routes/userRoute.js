import { Router } from "express";
const router = Router()

import addNewUser from "../controllers/userController.js";
router.route("/addNewUser").post(addNewUser)

export default router