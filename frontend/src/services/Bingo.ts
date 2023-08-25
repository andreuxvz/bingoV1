import axios from "axios";

const bingoService = (() => {
  const startGame = async (id: string) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/games/start`, {
      id,
    });
  };
  const getNewCard = async () => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/bingos`, {});
  };

  return {
    getNewCard,
    startGame,
  };
})();
export default bingoService;
