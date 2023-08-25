import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bingoSchema = new Schema({
  numbers: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const BingoModel = mongoose.model("Bingo", bingoSchema);
