import { useEffect, useState } from "react";

function App() {
  const [matrix, setMatrix] = useState([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);

  const automate = (prevMatrix: number[][]) => {
    const newMatrix = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];

    for (let i = 0; i < prevMatrix.length; i++) {
      const matrixRow = prevMatrix[i];
      const newMatrixRow = newMatrix[i];
      for (let j = 0; j < matrixRow.length; j++) {
        if (matrixRow[j] == 1) {
          // create cell up
          if (i - 1 >= 0) {
            newMatrix[i - 1][j] = 1;
          }

          //create cell down
          if (i + 1 < prevMatrix.length) {
            newMatrix[i + 1][j] = 1;
          }

          //create cell left
          if (j - 1 >= 0) {
            newMatrixRow[j - 1] = 1;
          }

          // create cell right
          if (j + 1 < matrixRow.length) {
            newMatrixRow[j + 1] = 1;
          }
        }
      }
    }

    return newMatrix;
  };

  useEffect(() => {
    const interval = setInterval(
      () => setMatrix((prev) => automate(prev)),
      600,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border p-2">
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
              key={`${rowIndex}-${columnIndex}`}
              className={
                cell == 0 ? "bg-red-500 h-6 w-full" : "bg-green-500 h-6 w-full"
              }
            ></span>
          )),
        )}
      </div>
      {/* <button
        onClick={automate}
        className="text-green-500 border px-2 cursor-pointer active:bg-green-500 active:text-white"
      >
        Next
      </button> */}
    </div>
  );
}

export default App;
