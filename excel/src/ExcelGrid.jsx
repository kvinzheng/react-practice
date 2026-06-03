import { useState, useEffect, useRef } from "react";
import "./ExcelGrid.css";

const ROWS = 20;
const COLS = 10;
const COL_LABELS = Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));

const generateGrid = () => {
  return Array.from({ length: ROWS }, () => {
    return Array.from({ length: COLS }, () => {
      return { value: "", taskId: null };
    });
  });
};

export default function ExcelGrid() {
  const [cells, setCells] = useState(generateGrid);
  const [sel, setSel] = useState(null);   // { sr, sc, er, ec }
  const [edit, setEdit] = useState(null); // { r, c, val }
  const dragRef = useRef(false);
  const fillRef = useRef(null);
  const selRef = useRef(null);
  selRef.current = sel;

  useEffect(() => {
    const onUp = () => {
      dragRef.current = false;
      const fv = fillRef.current;
      const s = selRef.current;
      fillRef.current = null;
      if (fv === null || !s) return;
      const r1 = Math.min(s.sr, s.er), r2 = Math.max(s.sr, s.er);
      const c1 = Math.min(s.sc, s.ec), c2 = Math.max(s.sc, s.ec);
      if (r1 === r2 && c1 === c2) return;
      setCells((prev) => {
        const next = prev.map((row) => row.map((cell) => ({ ...cell })));
        for (let r = r1; r <= r2; r++)
          for (let c = c1; c <= c2; c++) next[r][c].value = fv;
        return next;
      });
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, []);

  // formulas: =A1+B2 (single operator: + - * /), no regex
  const refValue = (s) => {
    const col = s.charCodeAt(0) - 65;
    const row = parseInt(s.slice(1), 10) - 1;
    return parseFloat(cells[row]?.[col]?.value) || 0;
  };

  const evalCell = (r, c) => {
    const raw = cells[r]?.[c]?.value ?? "";
    if (typeof raw !== "string" || !raw.startsWith("=")) return raw;
    for (const op of ["+", "-", "*", "/"]) {
      const i = raw.indexOf(op, 1);
      if (i > 1) {
        const a = refValue(raw.slice(1, i));
        const b = refValue(raw.slice(i + 1));
        return op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
      }
    }
    return raw;
  };

  const r1 = sel && Math.min(sel.sr, sel.er);
  const r2 = sel && Math.max(sel.sr, sel.er);
  const c1 = sel && Math.min(sel.sc, sel.ec);
  const c2 = sel && Math.max(sel.sc, sel.ec);
  const inSel = (r, c) => sel && r >= r1 && r <= r2 && c >= c1 && c <= c2;

  const commit = () => {
    if (!edit) return;
    setCells((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      next[edit.r][edit.c].value = edit.val;
      return next;
    });
    setEdit(null);
  };

  const nums = [];
  if (sel) {
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++) {
        const v = parseFloat(evalCell(r, c));
        if (!isNaN(v)) nums.push(v);
      }
  }
  const total = sel ? (r2 - r1 + 1) * (c2 - c1 + 1) : 0;
  const sum = nums.reduce((a, b) => a + b, 0);

  return (
    <div className="excel-wrapper">
      <div className="excel-grid">
        <div className="excel-row">
          <div className="excel-header excel-row-header" />
          {COL_LABELS.map((l) => (
            <div key={l} className="excel-header">{l}</div>
          ))}
        </div>
        {cells.map((row, r) => (
          <div key={r} className="excel-row">
            <div className="excel-header excel-row-header">{r + 1}</div>
            {row.map((cell, c) => {
              const editing = edit?.r === r && edit?.c === c;
              return (
                <div
                  key={c}
                  className={`excel-cell${inSel(r, c) ? " selected" : ""}`}
                  onMouseDown={(e) => {
                    if (editing) return;
                    e.preventDefault();
                    commit();
                    dragRef.current = true;
                    fillRef.current = cell.value !== "" ? cell.value : null;
                    setSel({ sr: r, sc: c, er: r, ec: c });
                  }}
                  onMouseEnter={() => {
                    if (dragRef.current) setSel((s) => ({ ...s, er: r, ec: c }));
                  }}
                  onDoubleClick={() => setEdit({ r, c, val: cell.value })}
                >
                  {editing ? (
                    <input
                      autoFocus
                      className="excel-input"
                      value={edit.val}
                      onChange={(e) => setEdit({ ...edit, val: e.target.value })}
                      onBlur={commit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commit();
                        if (e.key === "Escape") setEdit(null);
                      }}
                    />
                  ) : evalCell(r, c)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="excel-statusbar">
        {sel ? (
          <>
            <span>Cells: <strong>{total}</strong></span>
            <span>Count: <strong>{nums.length}</strong></span>
            {nums.length > 0 && (
              <>
                <span>Sum: <strong>{sum.toFixed(2)}</strong></span>
                <span>Avg: <strong>{(sum / nums.length).toFixed(2)}</strong></span>
              </>
            )}
          </>
        ) : (
          <span className="hint">Click + drag · Double-click to edit</span>
        )}
      </div>
    </div>
  );
}
