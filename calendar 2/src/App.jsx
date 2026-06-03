import { useState, useEffect } from "react";
import "./App.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = 24;
const CELL = 40;

function mockFetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { day: 1, hour: 8, name: "Meeting", duration: 3 },
        { day: 1, hour: 12, name: "Standup", duration: 1 },
        { day: 3, hour: 9, name: "Review", duration: 2 },
      ]);
    }, 500);
  });
}

function buildGrid(events) {
  const g = Array.from({ length: 7 }, () => Array(HOURS).fill(null));
  events.forEach(({ day, hour, ...rest }) => {
    g[day][hour] = rest;
  });
  return g;
}

// count earlier events whose span overlaps hour h
function depth(col, h) {
  let count = 0;
  for (let i = 0; i < h; i++) {
    const c = col[i];
    if (c && i + c.duration > h) count++;
  }
  return count;
}

export default function App() {
  const [grid, setGrid] = useState(() => buildGrid([]));
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await mockFetchEvents();
        setGrid(buildGrid(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  function update(d, h, val) {
    setGrid(g => g.map((col, i) =>
      i === d ? col.map((c, j) => j === h ? val : c) : col
    ));
  }

  const ev = sel && grid[sel.d][sel.h];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="calendar">
      <div className="hour-col">
        <div className="header" />
        {Array.from({ length: HOURS }, (_, h) => (
          <div key={h} className="hour-label">{h}:00</div>
        ))}
      </div>

      {grid.map((col, d) => (
        <div key={d} className="day-col">
          <div className="header">{DAYS[d]}</div>
          <div className="day-body" style={{ height: HOURS * CELL }}>
            {col.map((c, h) => (
              <div key={h} className="cell" style={{ top: h * CELL }}
                onClick={(e) => {
                  if (!c) update(d, h, { name: "New", duration: 1 });
                  setSel({ d, h, x: e.clientX, y: e.clientY });
                }}
              />
            ))}
            {col.map((c, h) => c && (
              <div key={h} className="event"
                style={{
                  top: h * CELL,
                  height: c.duration * CELL,
                  left: depth(col, h) * 12,
                }}
                onClick={(e) => setSel({ d, h, x: e.clientX, y: e.clientY })}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>
      ))}

      {ev && (
        <div className="popup" style={{ top: sel.y, left: sel.x + 10 }}>
          <input value={ev.name}
            onChange={e => update(sel.d, sel.h, { ...ev, name: e.target.value })} />
          <input type="number" value={ev.duration} min={1}
            onChange={e => update(sel.d, sel.h, { ...ev, duration: +e.target.value })} />
          <button onClick={() => { update(sel.d, sel.h, null); setSel(null); }}>Delete</button>
          <button onClick={() => setSel(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
