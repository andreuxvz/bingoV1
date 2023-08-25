import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  numbers: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const GameModel = mongoose.model("Game", gameSchema);
