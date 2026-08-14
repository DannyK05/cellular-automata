import { useEffect, useState } from "react";
import { generateZeroMatrix } from "./helper";

// const BASE_MATRIX = [
//   [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
// ];
function App() {
  const BASE_MATRIX = generateZeroMatrix(16, 16);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  const [matrix, setMatrix] = useState(BASE_MATRIX);

  const automate = (prevMatrix: number[][]) => {
    //generate new matrix default zeros from matrix dimensions
    const newMatrix = generateZeroMatrix(
      prevMatrix[0].length,
      prevMatrix.length,
    );

    for (let i = 0; i < prevMatrix.length; i++) {
      const prevMatrixRow = prevMatrix[i];
      const newMatrixRow = newMatrix[i];
      for (let j = 0; j < prevMatrixRow.length; j++) {
        let count = 0;

        // check neighbours

        //up
        if (i - 1 >= 0) {
          if (prevMatrix[i - 1][j] == 1) {
            count += 1;
          }
        }

        // down
        if (i + 1 < prevMatrix.length) {
          if (prevMatrix[i + 1][j] == 1) {
            count += 1;
          }
        }

        //left
        if (j - 1 >= 0) {
          if (prevMatrixRow[j - 1] == 1) {
            count += 1;
          }
        }

        // right
        if (j + 1 < prevMatrixRow.length) {
          if (prevMatrixRow[j + 1] === 1) {
            count += 1;
          }
        }

        // up left
        if (j - 1 >= 0 && i - 1 >= 0) {
          if (prevMatrix[i - 1][j - 1] === 1) {
            count += 1;
          }
        }

        // up right
        if (j + 1 < prevMatrixRow.length && i - 1 >= 0) {
          if (prevMatrix[i - 1][j + 1] === 1) {
            count += 1;
          }
        }

        // down left
        if (i + 1 < prevMatrix.length && j - 1 >= 0) {
          if (prevMatrix[i + 1][j - 1] === 1) {
            count += 1;
          }
        }

        // down right
        if (i + 1 < prevMatrix.length && j + 1 < prevMatrixRow.length) {
          if (prevMatrix[i + 1][j + 1] === 1) {
            count += 1;
          }
        }

        // kill or resurrect cells
        if (prevMatrixRow[j] === 1) {
          if (count < 2 || count > 3) {
            newMatrixRow[j] = 0;
          } else {
            newMatrixRow[j] = 1;
          }
        } else {
          if (count === 3) {
            newMatrixRow[j] = 1;
          }
        }
      }
    }

    return newMatrix;
  };

  const restartSimulation = () => {
    setMatrix(BASE_MATRIX);
  };

  const toggleCell = (
    prevMatrix: number[][],
    columnIndex: number,
    rowIndex: number,
  ) => {
    const initialMatrix = prevMatrix.map((row) => [...row]);

    if (initialMatrix[rowIndex][columnIndex] === 1) {
      initialMatrix[rowIndex][columnIndex] = 0;
    } else {
      initialMatrix[rowIndex][columnIndex] = 1;
    }

    return initialMatrix;
  };

  useEffect(() => {
    if (!playing) {
      return;
    }
    const interval = setInterval(
      () => setMatrix((prev) => automate(prev)),
      speed,
    );
    return () => clearInterval(interval);
  }, [speed, playing]);

  return (
    <div className="w-full border p-2">
      <p>Speed: {speed / 1000}sec</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)`,
        }}
        className="w-full"
      >
        {matrix.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <span
              onClick={() =>
                setMatrix((prev) => toggleCell(prev, columnIndex, rowIndex))
              }
              key={`${rowIndex}-${columnIndex}`}
              className={
                cell == 0
                  ? "bg-red-500 h-6 w-full cursor-pointer border"
                  : "bg-green-500 h-6 w-full cursor-pointer border"
              }
            ></span>
          )),
        )}
      </div>
      <div className="flex items-center justify-center space-x-4 p-2">
        <button
          onClick={() => setPlaying((prev) => !prev)}
          className="text-green-500 border px-2 cursor-pointer active:bg-green-500 active:text-white"
        >
          {!playing ? "Play" : "Pause"}
        </button>

        <button
          onClick={() => restartSimulation()}
          className="text-green-500 border px-2 cursor-pointer active:bg-green-500 active:text-white"
        >
          Restart
        </button>

        <button
          onClick={() => setSpeed((prev) => prev - 50)}
          className="text-green-500 border px-2 cursor-pointer active:bg-green-500 active:text-white"
        >
          Increase speed
        </button>
        <button
          onClick={() => setSpeed((prev) => prev + 50)}
          className="text-green-500 border px-2 cursor-pointer active:bg-green-500 active:text-white"
        >
          Reduce Speed
        </button>
      </div>
    </div>
  );
}

export default App;
