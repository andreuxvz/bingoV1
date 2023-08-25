import { Router } from "express";
import { startBingoGame } from "../controllers/BingoController";

const router = Router();

router.route("/start").post(startBingoGame);

export default router;
