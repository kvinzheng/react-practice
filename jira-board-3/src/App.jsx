import "./styles.css";
import { useState, useEffect, useMemo } from "react";
// state
// 2 d grid

// top row week day

//left column, hours

//each grid would have the following
// [[t1, null, null],[null, null, null]]

//ideally this would come from API
//server side rendeer this
const defaultEvent = {
  t1: {
    id: "t1",
    name: "pick up wife",
    startTime: 8,
    day: "Mon",
  },
};
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOURS = Array.from({ length: 24 }, (_, hourIndex) => {
  const suffix = hourIndex < 12 ? "am" : "pm";
  const display = hourIndex % 12 === 0 ? 12 : hourIndex % 12;
  return `${display}:00${suffix}`;
});


const mockEvents = () => Promise.resolve(defaultEvent);
export default function App() {
  // grid is now derived, not state
  const [events, setEvents] = useState(defaultEvent);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const fetchEvent = async () => {
    const data= await mockEvents();
    setEvents(data)
  };
  useEffect(() => {
    fetchEvent();
  }, []);

  // Derive grid from events using useMemo
  const grid = useMemo(() => {
    const g = Array.from({ length: 24 }, () =>
      Array.from({ length: 7 }, () => ({ value: null, taskId: null }))
    );
    for (const [taskId, event] of Object.entries(events)) {
      const dayIndex = WEEK.indexOf(event.day);
      const hourIndex = event.startTime;
      if (dayIndex < 0 || hourIndex < 0 || hourIndex > 23) continue;
      g[hourIndex][dayIndex] = { taskId, value: event.name };
    }
    return g;
  }, [events]);
  const handleOnChange = (e) => {
    setInput(e.target.value);
  };
  const handleOnClick = (day, hourIndex, dayIndex) => {
    setOpen(true);
    setCurrentEvent(grid[hourIndex][dayIndex].taskId);
    if (day.value) {
      setInput(grid[hourIndex][dayIndex].value);
      return;
    }

    //create a new event
    let newId;
    setEvents((prev) => {
      newId = `t${Object.keys(prev).length + 1}`;
      return {
        ...prev,
        [newId]: {
          id: newId,
          name: "new event",
          startTime: hourIndex,
          day: WEEK[dayIndex],
        },
      };
    });
    setCurrentEvent(newId);
    setInput("new event");
  };

  const handleClose = () => {
    setOpen(false);
    if (!currentEvent) return;
    setEvents((prev) => {
      if (!prev[currentEvent]) return prev;
      return {
        ...prev,
        [currentEvent]: { ...prev[currentEvent], name: input },
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };
  return (
    <div className="App">
      <div className="calendar">
        {open && (
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                {" "}
                <button type="button" onClick={handleClose}>close</button>
              </div>
              <div>
                <label>event</label>
                <input value={input} onChange={handleOnChange} autoFocus />
              </div>
            </form>
          </div>
        )}

        <div className="hours">
          <div className="hour"></div>
          {WEEK.map((day, dayIndex) => {
            return <div className="hour" key={day}>{day}</div>;
          })}
        </div>
        {grid.map((hours, hourIndex) => {
          return (
            <div className="hours" key={hourIndex}>
              <div className="hour">{HOURS[hourIndex]}</div>
              {hours.map((day, dayIndex) => {
                return (
                  <div
                    className="hour"
                    key={dayIndex}
                    onClick={() => handleOnClick(day, hourIndex, dayIndex)}
                  >
                    {day.value}
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
