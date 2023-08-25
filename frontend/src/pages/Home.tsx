import { Fragment, useEffect, useState } from "react";
import "./Home.css";
import bingoService from "../services/Bingo";
import Bingo from "../components/Bingo";
import Card from "../components/Card";

const Home = () => {
  const [cardNumbers, setCardsNumbers] = useState<{}>({});
  const [cardId, setCardId] = useState<string>("");
  const [gameResult, setGameResult] = useState<number[]>([]);
  const [bolaSelected, setBolaSelected] = useState(0);
  const [winnerInfo, setWinnerInfo] = useState<any>({});
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [isFinishedGame, setIsFinishedGame] = useState<boolean>(true);

  const getCard = async () => {
    const { data } = await bingoService.getNewCard();
    setGameResult([]);
    setBolaSelected(0);
    setCardId(data.data.bingo._id);
    setCardsNumbers(data.data.bingoOrdered);
    setIsWinner(false);
    setIsFinishedGame(false);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const startGame = async () => {
    if (cardId) {
      const { data } = await bingoService.startGame(cardId);
      setWinnerInfo(data.data.winnerInfo);
      getBola(data.data.winningNumbers, data.data.winnerInfo);
    }
  };

  useEffect(() => {}, [0]);

  const getBola = async (bingoResult: number[], winnerInfo: any) => {
    const newGameRes: number[] = [];

    for (let index = 0; index < bingoResult.length; index++) {
      const element = bingoResult[index];
      setBolaSelected(element);
      newGameRes.unshift(element);
      setGameResult([...newGameRes]);

      if (
        winnerInfo &&
        winnerInfo.winnerPosition > 4 &&
        index === winnerInfo.winnerPosition
      ) {
        setIsWinner(true);
        await sleep(2000);
      } else {
        await sleep(1000);
      }

      if (index + 1 === bingoResult.length) {
        setIsFinishedGame(true);
      }
    }
  };

  useEffect(() => {}, [0]);

  return (
    <Fragment>
      <div className="game">
        <Card
          cardNumbers={Object.values(cardNumbers)}
          getCard={getCard}
          isWinner={isWinner}
          gameResult={gameResult}
          isFinishedGame={isFinishedGame}
        />

        <Bingo
          cardNumbers={Object.values(cardNumbers).length}
          startGame={startGame}
          bolaSelected={bolaSelected}
          gameResult={gameResult}
        />
      </div>
      <div className="clear"></div>
      <div className="coments">
        <b>Información importante:</b>
        <br />
        <ol>
          <li>-Saldrán 45 bolas por cada cartilla comprada.</li>
          <li>-Al terminar el juego podrás comprar otra cartilla.</li>
          <li>-Los números de la cartilla se irán marcando automáticamente.</li>
          <li>
            -En la parte inferior encontraras un mensaje que te indicará si
            lograste ganar.
          </li>
        </ol>
      </div>
    </Fragment>
  );
};

export default Home;
