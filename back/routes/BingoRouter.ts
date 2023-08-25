import { Router } from "express";
import {
  getAllBingos,
  createBingo,
  getBingoById,
  updateBingo,
  deleteBingo,
} from "../controllers/BingoController";

const router = Router();

router.route("/").get(getAllBingos).post(createBingo);
router.route("/:id").get(getBingoById).put(updateBingo).delete(deleteBingo);

export default router;
