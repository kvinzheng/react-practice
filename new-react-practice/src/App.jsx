import "./App.css";
import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = ["red", "blue", "green", "orange", "purple", "teal"];

const buildGrid = () =>
  Array.from({ length: 24 }, () => Array.from({ length: 7 }, () => []));

export default function App() {
  const [grid, setGrid] = useState(buildGrid());
  const [cell, setCell] = useState({ x: 0, y: 0, order: 0 });
  const [open, setOpen] = useState(false);

  const handleAddItem = (row, col) => {
    setGrid((prev) => {
      const clone = prev.map((row) => {
        return row.map((col) => [...col]);
      });
      const order = clone[row][col].length;
      clone[row][col].push({ row, col, name: "newItem", length: 1 });
      setCell({ x: row, y: col, order });
      return clone;
    });
    setOpen(true);
  };

  const handleOnChange = (key, value) => {
    setGrid((prev) => {
      const clone = prev.map((row) => {
        return row.map((col) => {
          return [...col];
        });
      });
      clone[cell.x][cell.y][cell.order] = {
        ...clone[cell.x][cell.y][cell.order],
        [key]: value,
      };
      return clone;
    });
  };
  const handleClose = () => setOpen(false);

  const selected = open ? grid[cell.x]?.[cell.y]?.[cell.order] : null;
  const position = {
    top: `${((cell.x + 1) / 25) * 100}%`,
    left: `${((cell.y + 2) / 8) * 100}%`,
  };
  return (
    <div className="App">
      <div className="calendar">
        {selected && (
          <div className="modal" style={position}>
            <label>
              name
              <input
                value={selected.name}
                onChange={(e) => handleOnChange("name", e.target.value)}
              />
            </label>
            <label>
              length
              <input
                type="number"
                min="1"
                max={24 - cell.x}
                value={selected.length}
                onChange={(e) =>
                  handleOnChange("length", Number(e.target.value))
                }
              />
            </label>
            <button type="button" onClick={handleClose}>
              x
            </button>
          </div>
        )}
        <div className="row">
          <div className="col" />
          {DAYS.map((d) => (
            <div className="col" key={d}>
              {d}
            </div>
          ))}
        </div>
        {grid.map((row, rowIndex) => {
          return (
            <div className="row">
              <div className="col">{rowIndex}</div>
              {row.map((col, colIndex) => {
                return (
                  <div
                    className="col"
                    onClick={() => {
                      handleAddItem(rowIndex, colIndex);
                    }}
                  >
                    {col.map((item, itemIndex) => {
                      return (
                        <span
                          key={itemIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCell({
                              x: rowIndex,
                              y: colIndex,
                              prder: itemIndex,
                            });
                            setOpen(true);
                          }}
                          style={{
                            top: 0,
                            left: `0%`,
                            width: `100%`,
                            height: item.length * 40,
                            zIndex: itemIndex + 1,
                            background:
                              COLORS[
                                (rowIndex + colIndex + itemIndex) %
                                  COLORS.length
                              ],
                          }}
                        >
                          {item.name}
                        </span>
                      );
                    })}
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
