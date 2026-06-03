import "./styles.css";
import { useState, useEffect } from "react";
// state
// 2 d grid

// top row week day

//left column, hours

//each grid would have the following
// [[t1, null, null],[null, null, null]]

//ideally this would come from API
//server side rendeer this
const events = {
  t1: { name: "event 1", startTime: 8, day: "Mon" },
  t2: { name: "event 2", startTime: 9, day: "Mon" }
};
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOURS = Array.from({ length: 24 }, (_, hourIndex) => {
  const h = hourIndex % 12 === 0 ? 12 : hourIndex % 12;
  const suffix = hourIndex < 12 ? "am" : "pm";
  return `${h}:00${suffix}`;
});

const generateGrid = () => {
  return Array.from({ length: 24 }, () => {
    return Array.from({ length: 7 }, () => {
      return { value: null, taskId: null };
    });
  });
};

export default function App() {
  const [grid, setGrid] = useState(generateGrid());
  const [eventsState, setEvents] = useState(events);
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  useEffect(() => {
    const eventValue = Object.entries(eventsState);
    eventValue.forEach(([taskId, event]) => {
      const dayIndex = WEEK.indexOf(event.day);
      const hourIndex = event.startTime;
      setGrid((prev) => {
        const clone = prev.map((row) => [...row].map((col) => ({ ...col })));
        clone[hourIndex][dayIndex] = {
          taskId,
          value: event.name,
        };
        return clone;
      });
    });
  }, [eventsState]);
  
  const handleOnChange = (e) => {
    setEvents((prev) => ({
      ...prev,
      [currentEvent]: { ...prev[currentEvent], name: e.target.value },
    }));
  };
  const handleOnClick = (day, hourIndex, dayIndex) => {
    setOpen(true);
    const existingId = grid[hourIndex][dayIndex].taskId;
    if (existingId) {
      setCurrentEvent(existingId);
      return;
    }

    //create a new event
    const id = `t${Object.keys(eventsState).length + 1}`;
    setEvents((prev) => ({
      ...prev,
      [id]: {
        id,
        name: "new event",
        startTime: hourIndex,
        day: WEEK[dayIndex],
      },
    }));
    setCurrentEvent(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="App">
      <div className="calendar">
        {open && (
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                {" "}
                <button onClick={handleClose}>close</button>
              </div>
              <div>
                <label>event</label>
                <input value={eventsState[currentEvent]?.name} onChange={handleOnChange} />
              </div>
            </form>
          </div>
        )}

        <div className="hours">
          <div className="hour"></div>
          {WEEK.map((day, dayIndex) => {
            return <div className="hour" key={dayIndex}>{day}</div>;
          })}
        </div>
        {grid.map((hours, hourIndex) => {
          return (
            <div className="hours" key={hourIndex}>
              <div className="hour">{HOURS[hourIndex]}</div>
              {hours.map((day, dayIndex) => {
                return (
                  <div
                    key={dayIndex}
                    className="hour"
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
