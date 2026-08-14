export const generateZeroMatrix = (
  rows: number,
  columns: number,
): number[][] => {
  const matrix = [];
  for (let i = 0; i < columns; i++) {
    matrix.push(Array(rows).fill(0));
  }

  return matrix;
};
