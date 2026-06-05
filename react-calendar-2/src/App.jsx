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
  if (hourIndex < 12) {
    return `${hourIndex}:00am`;
  } else {
    return `${hourIndex % 12}:00pm`;
  }
});

const generateGrid = () => {
  return Array.from({ length: 24 }, (_, hourIndex) => {
    return Array.from({ length: 7 }, (_, weekIndex) => {
      return { value: null, taskId: null };
    });
  });
};

const mockEvents = () => {
  return new Promise((resolve, reject) => {
    resolve(defaultEvent);
  });
};
export default function App() {
  // const [grid, setGrid] = useState(generateGrid());
  const [events, setEvents] = useState(defaultEvent);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [currentEvent, setCurrentEven] = useState(null);
  const fetchEvent = async () => {
    setEvents(await mockEvents());
  };
  useEffect(() => {
    fetchEvent();
  }, []);
  const grid = useMemo(() => {
    const eventValue = Object.entries(events);
    const cloneGrid = generateGrid();
    eventValue.forEach(([taskId, event]) => {
      const dayIndex = WEEK.indexOf(event.day);
      const hourIndex = event.startTime;
      cloneGrid[hourIndex][dayIndex] = {
        taskId,
        value: event.name,
      };
    });
    return cloneGrid
  }, [events]);

  const handleOnChange = (e) => {
    setInput(e.target.value);
  };
  const handleOnClick = (day, hourIndex, dayIndex) => {
    setOpen(true);
    setCurrentEven(grid[hourIndex][dayIndex].taskId);
    console.log("day.value", day.value);
    if (day.value) {
      setInput(grid[hourIndex][dayIndex].value);
      return;
    }

    const eventLength = Object.keys(events).length;
    const id = `t${eventLength + 1}`;

    //create a new event
    setEvents((prev) => {
      const clone = { ...prev };
      clone[id] = {
        id,
        name: grid[hourIndex][dayIndex].value || "new event",
        startTime: hourIndex,
        day: WEEK[dayIndex],
      };
      return clone;
    });
    setCurrentEven(id);
    setInput("new event");
  };

  const handleClose = () => {
    setOpen(false);
    setEvents((prev) => {
      const clone = { ...prev };
      clone[currentEvent] = {
        ...clone[currentEvent],
        name: input,
      };
      return clone;
    });
  };

  const handleDelete = () => {
    setEvents((prev) => {
      const clone = { ...prev };
      delete clone[currentEvent];
      return clone;
    });

    setCurrentEven(null);
    setInput("");
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  // Memo(<Component />)
  // Memo()
  return (
    <div className="App">
      <div className="calendar">
        {open && (
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                {" "}
                <button onClick={handleClose}>close</button>
                <button type="button" onClick={handleDelete}>
                  delete
                </button>
              </div>
              <div>
                <label>event</label>
                <input value={input} onChange={handleOnChange} />
              </div>
            </form>
          </div>
        )}

        <div className="hours">
          <div className="hour"></div>
          {WEEK.map((day, dayIndex) => {
            return <div className="hour">{day}</div>;
          })}
        </div>
        {grid.map((hours, hourIndex) => {
          return (
            <div className="hours">
              <div className="hour">{HOURS[hourIndex]}</div>
              {hours.map((day, dayIndex) => {
                return (
                  <div
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
