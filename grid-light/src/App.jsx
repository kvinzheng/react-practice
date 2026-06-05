import { useEffect, useMemo, useState } from 'react';
import './App.css';

const CONFIG = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

const DEACTIVATE_MS = 300;

const ROWS = CONFIG.length;
const COLS = CONFIG[0].length;
const TOTAL_ACTIVE = CONFIG.reduce(
  (n, row) => n + row.reduce((m, c) => m + c, 0),
  0,
);

const cellKey = (r, c) => `${r},${c}`;

export default function App() {
  const [order, setOrder] = useState([]);
  const [deactivating, setDeactivating] = useState(false);
  const activated = useMemo(() => new Set(order), [order]);

  const handleClick = (key) => {
    if (deactivating || activated.has(key)) return;
    const next = [...order, key];
    setOrder(next);
    if (next.length === TOTAL_ACTIVE) setDeactivating(true);
  };

  useEffect(() => {
    if (!deactivating) return;
    const timer = setInterval(() => {
      setOrder((prev) => prev.slice(0, -1));
    }, DEACTIVATE_MS);
    return () => clearInterval(timer);
  }, [deactivating]);

  useEffect(() => {
    if (deactivating && order.length === 0) setDeactivating(false);
  }, [deactivating, order]);

  return (
    <div className="app">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {CONFIG.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 0) {
              return (
                <div
                  key={cellKey(r, c)}
                  className="cell cell--empty"
                  aria-hidden="true"
                />
              );
            }
            const key = cellKey(r, c);
            const isActive = activated.has(key);
            return (
              <button
                key={key}
                type="button"
                className={`cell cell--button${isActive ? ' cell--active' : ''}`}
                aria-label={`Cell row ${r + 1} column ${c + 1}`}
                aria-pressed={isActive}
                disabled={isActive || deactivating}
                onClick={() => handleClick(key)}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
