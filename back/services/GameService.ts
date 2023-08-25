import { IGame } from "../interfaces";
import { GameModel } from "../model/Game";

const gameService = (() => {
  const startBingoGame = async (winningNumbers: number[]) => {
    return await GameModel.create({ numbers: winningNumbers });
  };

  return {
    startBingoGame,
  };
})();

export default gameService;
