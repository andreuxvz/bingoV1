import { Fragment } from "react";

const Card = ({
  gameResult,
  getCard,
  cardNumbers,
  isWinner,
  isFinishedGame,
}: {
  cardNumbers: any;
  isFinishedGame: boolean;
  isWinner: boolean;
  getCard: any;
  gameResult: number[];
}) => {
  return (
    <div className="cardPlayer">
      <button onClick={getCard} disabled={!isFinishedGame}>
        Nueva Cartilla
      </button>
      <div className="clear"></div>
      {cardNumbers.length > 0 && (
        <div className="card">
          <div className="headers">
            <div>
              <span>B</span>
            </div>
            <div>
              <span>I</span>
            </div>
            <div>
              <span>N</span>
            </div>
            <div>
              <span>G</span>
            </div>
            <div>
              <span>O</span>
            </div>
          </div>
          {Object.values(cardNumbers).map((colum: any, colIdx: number) => {
            return (
              <div className={`column ${colIdx + 1}`} key={colIdx}>
                {colum &&
                  colum.map((number: number) => {
                    const focus = gameResult.find(
                      (winnerNumber: number) => winnerNumber === number
                    );
                    return (
                      <div
                        className={`number bola-${number} focus`}
                        key={number}
                      >
                        <span>{number !== 0 ? number : "FREE"}</span>
                        {focus !== undefined && number !== 0 && (
                          <span className="mark">X</span>
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}

      <div className="clear">
        <br />
      </div>
      {isWinner ? (
        <div className="flicker"> "BINGO!!" </div>
      ) : isFinishedGame && cardNumbers.length > 0 ? (
        <div>"SIGA INTENTANDO"</div>
      ) : (
        ""
      )}

      <br />
    </div>
  );
};

export default Card;
