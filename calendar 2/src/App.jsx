import { useEffect, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

const generateGrid = () => {
  return Array.from({ length: 7 }, () => {
    return Array.from({ length: 24 }, () => {
      return null;
    });
  });
};

function App() {
  const [grid, setGrid] = useState(generateGrid());
  const [activeGridCell, setActiveGridCell] = useState({
    row: 0,
    col: 0,
  });
  const [open, setOpen] = useState(false);

  const handleAddEvent = (rowIndex, colIndex) => {
    setOpen(true);
    setActiveGridCell({ row: rowIndex, col: colIndex });
    if (grid[rowIndex][colIndex]?.id !== undefined) {
      return;
    }
    setGrid((prev) => {
      const clone = prev.map((row) =>
        row.map((col) => (col ? { ...col } : col)),
      );
      clone[rowIndex][colIndex] = {
        name: "newEvent",
        id: `${rowIndex}-${colIndex}`,
      };
      return clone;
    });
  };

  const handleOnChange = (e) => {
    console.log("value", e.target.value);
    setGrid((prev) => {
      const clone = prev.map((row) =>
        row.map((col) => (col ? { ...col } : col)),
      );

      clone[activeGridCell.row][activeGridCell.col].name = e.target.value;
      return clone;
    });
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const row = `${(activeGridCell.row / 7) * 100}%`;
  const col = `${(activeGridCell.col / 24) * 100}%`;

  return (
    <div className="container">
      {open && (
        <form className="pop-up-form" style={{ left: row, top: col }}>
          <input
            value={grid[activeGridCell.row][activeGridCell.col]?.name}
            onChange={handleOnChange}
          />
          <button onClick={handleOpen}>close</button>
        </form>
      )}
      <div className="row">
        {grid.map((row, rowIndex) => {
          return (
            <div>
              {row.map((col, colIndex) => {
                return (
                  <div
                    className="grid-cell"
                    onClick={() => handleAddEvent(rowIndex, colIndex)}
                  >
                    {col?.name}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
