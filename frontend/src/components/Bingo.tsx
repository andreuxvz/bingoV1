const Bingo = ({
  cardNumbers,
  startGame,
  bolaSelected,
  gameResult,
}: {
  cardNumbers: any;
  startGame: any;
  bolaSelected: number;
  gameResult: number[];
}) => {
  return (
    <div className="bingo">
      <b>ÚLTIMA BOLA N.</b>
      <div className="bola">{bolaSelected}</div>
      <button
        onClick={startGame}
        disabled={cardNumbers === 0 || gameResult.length > 0}
      >
        Empezar el juego
      </button>
      <div>
        <br />
        <b>Resultados:</b>
        <br />
        {gameResult?.map((numberWinner: number) => {
          return numberWinner !== 0 && <span>{`${numberWinner}, `}</span>;
        })}
      </div>
    </div>
  );
};

export default Bingo;
