import "./ExcelGrid.css";
import { useState, useEffect, useRef } from "react";

const COLS = 10;
const COL_LABELS = Array.from({ length: COLS }, (_, i) => {
  return String.fromCharCode(65 + i);
});
const generateGrid = () => {
  return Array.from({ length: 20 }, () => {
    return Array.from({ length: 10 }, () => {
      return { value: null, taskId: null };
    });
  });
};

function getRange(s) {
  const r1 = Math.min(s.startRow, s.endRow);
  const r2 = Math.max(s.startRow, s.endRow);
  const c1 = Math.min(s.startCol, s.endCol);
  const c2 = Math.max(s.startCol, s.endCol);
  return { r1, r2, c1, c2 };
}

function evalFormula(formula, cells) {
  const upper = formula.toUpperCase();
  const isSUM = upper.startsWith("=SUM(");
  const isAVG = upper.startsWith("=AVG(");
  if (!isSUM && !isAVG) return formula;

  const inner = upper.slice(5, -1);
  const [start, end] = inner.split(":");

  const c1 = start[0].charCodeAt(0) - 65;
  const r1 = parseInt(start.slice(1)) - 1;
  const c2 = end[0].charCodeAt(0) - 65;
  const r2 = parseInt(end.slice(1)) - 1;

  let sum = 0;
  let count = 0;
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      sum += parseFloat(cells[r][c].value) || 0;
      count++;
    }
  }

  if (isAVG) return count > 0 ? sum / count : 0;
  return sum;
}

export default function ExcelGrid() {
  const [cells, setCells] = useState(generateGrid());
  const [cell, setCell] = useState(null);  // { startRow, startCol, endRow, endCol }
  const [edit, setEdit] = useState(null); // { r, c, val }
  const dragRef = useRef(false);
  const fillRef = useRef(null); // { value, startRow, startCol, endRow, endCol }

  useEffect(() => {

    const onUp = () => {
      dragRef.current = false;

      const fill = fillRef.current;
      fillRef.current = null;

      if(!fill || fill.value === null) return;

      const {r1, r2, c1, c2} = getRange(fill);
      if(r1 === r2 && c1 === c2) return;

      setCells((prev) => {
        const next = prev.map((row) => {
          return row.map((cell) => {
            return {...cell};
          })
        })
        for(let r = r1; r <= r2; r++) {
          for(let c = c1; c <= c2; c++) {
            next[r][c].value = fill.value;
          }
        }

        return next;
      })
    }

    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  const range = cell ? getRange(cell) : null;
  const inCell = (r, c) => {
    if (!range) return false;
    return r >= range.r1 && r <= range.r2 && c >= range.c1 && c <= range.c2;
  };

  const commit = () => {
    if (!edit) return;
    setCells((prev) => {
      const next = prev.map((row) => {
        return row.map((cell) => {
          return { ...cell };
        });
      });
      next[edit.r][edit.c].value = evalFormula(edit.val, next);
      return next;
    });
    setEdit(null);
  };
  // TODO: Build an Excel-like grid with:
  //   1. Cells you can click to select
  //   2. Drag across cells to select a range
  //   3. Double-click to edit a cell value
  //   4. Status bar showing Count / Sum / Average of selected numeric cells

  return (
    <div className="excel-wrapper">
      <div className="excel-row">
        <div className="excel-header excel-row-header" />
        {COL_LABELS.map((letter, letterIndex) => (
          <div key={letterIndex} className="excel-header">
            {letter}
          </div>
        ))}
      </div>
      {cells.map((row, rowIndex) => (
        <div key={rowIndex} className="excel-row">
          <div className="excel-header excel-row-header">{rowIndex + 1}</div>
          {row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`excel-cell${inCell(rowIndex, colIndex) ? " selected" : ""}`}
              onMouseDown={(e) => {
                if (edit?.r === rowIndex && edit?.c === colIndex) return;
                e.preventDefault();
                dragRef.current = true;
                fillRef.current = { value: col.value ?? null, startRow: rowIndex, startCol: colIndex, endRow: rowIndex, endCol: colIndex };
                setCell({ startRow: rowIndex, startCol: colIndex, endRow: rowIndex, endCol: colIndex });
              }}
              onMouseEnter={() => {
                if (!dragRef.current) return;
                if (fillRef.current) {
                  fillRef.current.endRow = rowIndex;
                  fillRef.current.endCol = colIndex;
                }
                setCell((s) => ({ ...s, endRow: rowIndex, endCol: colIndex }));
              }}
              onDoubleClick={() =>
                setEdit({ r: rowIndex, c: colIndex, val: col.value ?? "" })
              }
            >
              {edit?.r === rowIndex && edit?.c === colIndex ? (
                <input
                  autoFocus
                  className="excel-input"
                  value={edit.val}
                  onChange={(e) => {
                    setEdit({...edit, val: e.target.value})
                  }}
                  onBlur={commit}
                  onKeyDown={(e) =>{
                    if(e.key === 'Enter') {
                      commit()
                    }
                    if(e.key === 'Escape') {
                      setEdit(null)
                    }
                  }}
                />
              ) : (
                col.value
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
