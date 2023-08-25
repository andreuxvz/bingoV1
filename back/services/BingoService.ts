import { IBingo } from "../interfaces";
import { ObjectId } from "mongodb";
import { BingoModel } from "../model/Bingo";

const bingoService = (() => {
  const getAllBingos = async () => {
    return await BingoModel.find();
  };

  const createBingo = async (bingo: IBingo) => {
    return await BingoModel.create(bingo);
  };

  const getBingoById = async (id: ObjectId) => {
    return await BingoModel.findById(id);
  };

  const updateBingo = async (id: ObjectId, bingo: IBingo) => {
    return await BingoModel.findByIdAndUpdate(id, bingo);
  };

  const deleteBingo = async (id: any) => {
    return await BingoModel.findByIdAndDelete(id);
  };

  return {
    createBingo,
    deleteBingo,
    getBingoById,
    updateBingo,
    getAllBingos,
  };
})();

export default bingoService;
