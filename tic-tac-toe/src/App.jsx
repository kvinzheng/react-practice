import { useState } from "react";
import "./App.css";

const SIZE = 3;
const CELLS_IN_A_LINE = [
  // rows
  [[0, 0], [0, 1], [0, 2]], // top row
  [[1, 0], [1, 1], [1, 2]], // middle row
  [[2, 0], [2, 1], [2, 2]], // bottom row
  // columns
  [[0, 0], [1, 0], [2, 0]], // left column
  [[0, 1], [1, 1], [2, 1]], // middle column
  [[0, 2], [1, 2], [2, 2]], // right column
  // diagonals
  [[0, 0], [1, 1], [2, 2]], // top-left to bottom-right
  [[0, 2], [1, 1], [2, 0]], // top-right to bottom-left
];

function createBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function calculateWinner(board) {
  for (const line of CELLS_IN_A_LINE) {
    const [[ar, ac], [br, bc], [cr, cc]] = line;
    const a = board[ar][ac];
    const b = board[br][bc];
    const c = board[cr][cc];
    if (a != null && a === b && a === c) {
      return { winner: a, line };
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(createBoard());
  const [xIsNext, setXIsNext] = useState(true);

  const result = calculateWinner(board);
  const isDraw = !result && board.flat().every(Boolean);

  function getStatus() {
    if (result) return `Winner: ${result.winner}`;
    if (isDraw) return "Draw";
    return `Next: ${xIsNext ? "X" : "O"}`;
  }

  const status = getStatus();

  function handleClick(r, c) {
    if (board[r][c] || result) return;
    setBoard(function (prev) {
      return prev.map(function (row, ri) {
        return row.map(function (v, ci) {
          if (ri === r && ci === c) {
            return xIsNext ? "X" : "O";
          }
          return v;
        });
      });
    });
    setXIsNext(function (prev) {
      return !prev;
    });
  }

  function reset() {
    setBoard(createBoard());
    setXIsNext(true);
  }

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="status">{status}</div>
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 5rem)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isWin = result?.line.some(
              ([wr, wc]) => wr === r && wc === c,
            );
            return (
              <button
                key={`${r}-${c}`}
                className={`square${isWin ? " win" : ""}`}
                onClick={() => handleClick(r, c)}
                disabled={Boolean(cell) || Boolean(result)}
              >
                {cell}
              </button>
            );
          }),
        )}
      </div>
      <div className="controls">
        <button onClick={reset}>New Game</button>
      </div>
    </div>
  );
}
