import { Request, Response } from "express";
import { IBingo } from "../interfaces";
import bingoService from "../services/BingoService";
import gameService from "../services/GameService";
import mongoose from "mongoose";

export const getAllBingos = async (req: Request, res: Response) => {
  try {
    const bingos = await bingoService.getAllBingos();
    res.json({ data: bingos, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const getRamdomNumberByRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isUniqueNumber = (arr: number[], rNumber: number) => {
  return arr.find((numBingo: number) => numBingo === rNumber);
};

const getRandomUniqueNumbers = (
  quantity: number,
  minRange: number,
  maxRange: number
) => {
  let counter = 1;
  const gameArr = [0]; // 0 es free de la columna N fila 3
  while (counter <= quantity) {
    const rNumber = getRamdomNumberByRange(minRange, maxRange);
    if (!isUniqueNumber(gameArr, rNumber)) {
      gameArr.push(rNumber);
      counter++;
    }
  }
  return gameArr;
};

const splitToNChunks = (array: number[], parts: number) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};

const getMatrixDiagonals = (matrix: number[][]) => {
  const firstDiagonal = matrix.map((list: number[], index) => list[index]);
  const secondDiagonal = [...matrix]
    .reverse()
    .map((list: number[], index) => list[index]);
  return [firstDiagonal, secondDiagonal];
};

const getTransposeMatrix = (m: number[][]) =>
  m[0].map((x: number, i: number) => m.map((x: number[]) => x[i]));

const checkAxisXAxisYDiagonal = (
  axis: number[][],
  index: number,
  winningNumbers: number[]
) => {
  const status = axis[index].every((item, index) => {
    // if (index > newWinnerPosition) newWinnerPosition = index;
    return winningNumbers.includes(item);
  });

  // if (
  //   (status && newWinnerPosition < winnerPosition) ||
  //   (winnerPosition === 0 && newWinnerPosition > 0)
  // ) {
  //
  //   winnerPosition = newWinnerPosition;
  // }

  return {
    arr: axis[index],
    status,
  };
};

// obtenemos el primer ganador con menor cantidad de bolas
const getWinnerPosition = (rowColumWinners: any, winningNumbers: number[]) => {
  let winnerPosition = 0;
  for (const key in rowColumWinners) {
    const element = rowColumWinners[key];
    if (element.status) {
      const newWinnerPosition = element.arr.reduce(
        (current: number, newValue: number) => {
          const index = winningNumbers.findIndex(
            (winningNumber) => winningNumber === newValue
          );
          if (index > current) {
            current = index;
          }
          return current;
        },
        0
      );
      if (
        winnerPosition === 0 ||
        (winnerPosition !== 0 && newWinnerPosition < winnerPosition)
      ) {
        winnerPosition = newWinnerPosition;
      }
    } else {
      continue;
    }
  }

  return winnerPosition;
};

const checkColumsRowsMatrix = async (
  winningNumbers: number[],
  bingo: IBingo
) => {
  const bingoMatrix = splitToNChunks([...bingo.numbers], 5);
  const bingoMatrixDiagonal = getMatrixDiagonals(bingoMatrix);
  const bingoMatrixTranspose = getTransposeMatrix(bingoMatrix);

  let rowColumChecked: any = {};
  for (let index = 4; index < winningNumbers.length; index++) {
    const element = winningNumbers[index];
    const indexElemn = bingo.numbers.findIndex(
      (bingoItem: number) => bingoItem === element
    );

    const isDiagonalElem = bingoMatrixDiagonal[0]
      .concat(bingoMatrixDiagonal[1])
      .find((elemDiagonal) => elemDiagonal === element);

    if (indexElemn !== -1) {
      const coorX = Math.floor(indexElemn / 5);
      const coorY = indexElemn % 5;
      if (!rowColumChecked[`${coorX}X`]) {
        //validamos eje X
        const rowCheck = checkAxisXAxisYDiagonal(
          bingoMatrix,
          coorX,
          winningNumbers
        );
        rowColumChecked[`${coorX}X`] = rowCheck;
      }

      if (!rowColumChecked[`${coorY}Y`]) {
        //validamos eje y
        const columnCheck = checkAxisXAxisYDiagonal(
          bingoMatrixTranspose,
          coorY,
          winningNumbers
        );
        rowColumChecked[`${coorX}Y`] = columnCheck;
      }
      if (isDiagonalElem) {
        for (let j = 0; j < bingoMatrixDiagonal.length; j++) {
          //validamos ejes diagonales
          if (!rowColumChecked[`${j}D`]) {
            const diagonalCheck = checkAxisXAxisYDiagonal(
              bingoMatrixDiagonal,
              j,
              winningNumbers
            );
            rowColumChecked[`${j}D`] = diagonalCheck;
          }
        }
      }
    }
  }

  const winnerPosition: number = getWinnerPosition(
    rowColumChecked,
    winningNumbers
  );
  return {
    winnerPosition,
    rowColumChecked,
  };
};

//Funcion que inicia el juego de Bingo
export const startBingoGame = async (req: Request, res: Response) => {
  const winningNumbers = getRandomUniqueNumbers(45, 1, 75);
  try {
    await gameService.startBingoGame(winningNumbers);
    const bingo: any = await bingoService.getBingoById(
      new mongoose.Types.ObjectId(req.body.id)
    );
    const winnerInfo = await checkColumsRowsMatrix(winningNumbers, bingo);
    res.json({ data: { winningNumbers, winnerInfo }, status: "success" });
  } catch (err: any) {
    res.status(500).json({
      error: err.message,
      statusMsg: "El juego no pudo iniciar",
      body: req.body,
    });
  }
};

//Funcion que adquiere una tarjeta de bingo para el jugador
export const createBingo = async (req: Request, res: Response) => {
  try {
    var arrBingo: number[] = [];
    let columns = ["B", "I", "N", "G", "O"];
    let columnRange = 15;
    const bingoOrdered: any = {};

    //iteramos columns
    columns.forEach((column, columIdx) => {
      let maxItemsByColumn = 5;
      let counter = 1;

      while (counter <= maxItemsByColumn) {
        let rNumber = getRamdomNumberByRange(
          columnRange * columIdx + 1,
          columnRange * (columIdx + 1)
        );
        if (column === "N" && counter == 3) rNumber = 0; // para la columna N fila 3 valor "FREE"
        if (!isUniqueNumber(arrBingo, rNumber)) {
          if (!bingoOrdered[column]) {
            bingoOrdered[column] = [rNumber];
          } else {
            bingoOrdered[column].push(rNumber);
          }
          arrBingo.push(rNumber);
          counter++;
        }
      }
    });

    try {
      const bingo = await bingoService.createBingo({ numbers: arrBingo });
      res.json({ data: { bingo, bingoOrdered }, status: "success" });
    } catch (error) {
      res.status(500).json({ status: "No se pudo adquirir la cartilla" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBingoById = async (req: Request, res: Response) => {
  try {
    const bingo = await bingoService.getBingoById(
      new mongoose.Types.ObjectId(req.body.id)
    );
    res.json({ data: bingo, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBingo = async (req: Request, res: Response) => {
  try {
    const bingo = await bingoService.updateBingo(
      new mongoose.Types.ObjectId(req.body.id),
      req.body
    );
    res.json({ data: bingo, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBingo = async (req: Request, res: Response) => {
  try {
    const bingo = await bingoService.deleteBingo(
      new mongoose.Types.ObjectId(req.body.id)
    );
    res.json({ data: bingo, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
