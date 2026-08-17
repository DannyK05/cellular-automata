import { useEffect, useState } from "react";
import { generateZeroMatrix } from "./helper";
import { twMerge } from "tailwind-merge";
import {
  FastForward,
  Grid2X2Icon,
  PauseIcon,
  PlayIcon,
  Rewind,
  RotateCcw,
  Square,
} from "lucide-react";

function App() {
  const BASE_MATRIX = generateZeroMatrix(12, 12);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [borderOn, setBorderOn] = useState(true);
  const [matrix, setMatrix] = useState(BASE_MATRIX);

  const controls = [
    {
      effect: () => setPlaying((prev) => !prev),
      children: () => (!playing ? <PlayIcon /> : <PauseIcon />),
    },
    {
      effect: () => restartSimulation(),
      children: () => <RotateCcw />,
    },
    {
      effect: () => setSpeed((prev) => prev + 50),
      children: () => <Rewind />,
    },
    {
      effect: () =>
        setSpeed((prev) => {
          if (prev > 50) {
            prev = prev - 50;
          }
          return prev;
        }),
      children: () => <FastForward />,
    },
    {
      effect: () => setBorderOn((prev) => !prev),
      children: () => (!borderOn ? <Grid2X2Icon /> : <Square />),
    },
  ];

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
    <div className="w-full border py-2 px-4 bg-[#6A46CA] shadow-[var(--emulator-shadow)] rounded-b-xl lg:w-3/5">
      <h2 className="text-center press-start text-[#CD8329]">
        Conway Game of Life Simulator
      </h2>
      <div className="w-fit flex items-center space-x-4 p-1 mb-2 border border-purple-800 text-[8px] text-green-900 font-bold press-start bg-green-200">
        <p>Speed: {(1 / (speed / 1000)).toFixed(2)}frm/secs</p>
        {/* <p>Generation: {speed / 1000}sec</p> */}
      </div>
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
              className={twMerge(
                !playing && cell === 0 && "bg-red-200",
                playing && cell === 0 && "bg-green-200",
                cell == 1 && "bg-green-800",
                borderOn && "border",
                "h-6 w-full cursor-pointer border-green-900 active:bg-green-300 active:p-2 hover:lg:bg-green-600 active:lg:bg-green-300 active:lg:p-2",
              )}
            ></span>
          )),
        )}
      </div>
      <sub className="press-start text-[#CD8329]">Kxlade</sub>
      <div className="flex items-center justify-center space-x-4 px-2 py-6">
        {controls.map(({ children, effect }) => (
          <button
            onClick={effect}
            className="text-[#CD8329] bg-purple-800 shadow-[var(--button-shadow)] rounded-lg py-1 px-2 cursor-pointer lg:hover:bg-purple-700 active:shadow-[var(--button-pressed)] active:text-white"
          >
            {children()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
