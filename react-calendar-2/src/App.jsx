import { useState, useMemo, useRef } from "react";
import "./styles.css";

const DAYS = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const START_HOUR = 8;
const END_HOUR = 20; // 8 PM
//requirement
//1. build 2 d grid - timeline vertically/weekly horizontally
//2. add event / delete/ edit
//3. optional (more than 1 event)

// <Calendar />
// <td> <EventTainer></td>

// <Modal />

// state management
//1 event
// const defaultEvent = {
//   t1: { activity: "pick up" },
// };
//2 grid
// grid boxd state { value: "", status: "enabled", event: "t1" }
// when creating a new one, i will create a new event id, and map the event state
//3. modal open
//4. current row current col which are used for selected
const generateTimeline = () => {
  const arr = [];
  for (let i = START_HOUR; i < END_HOUR; i++) {
    if (i > 12) {
      const number = Math.floor(i % 12);
      arr.push(`${number}.00pm`);
    } else {
      arr.push(`${i}.00am`);
    }
  }
  return arr;
};

const generate2dGrid = () => {
  const timeline = generateTimeline();

  const grid = Array.from({ length: 12 }, (hour, hourIndex) => {
    return Array.from({ length: 8 }, (weekDay, weekIndex) => {
      if (weekIndex === 0) {
        return {
          value: timeline[hourIndex],
          status: "disabled",
          event: null,
          location: `${hourIndex}_${weekIndex}`,
          row: hourIndex,
          col: weekIndex,
        };
      }
      return { value: "", status: "enabled", event: null };
    });
  });
  grid.unshift(DAYS);
  return grid;
};
export default function App() {
  // const [grid, setGrid] = useState(generate2dGrid());
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const nextIdRef = useRef(1);
  const [events, setEvent] = useState({});

  const grid = useMemo(() => {
    const g = generate2dGrid();
    console.log("Object.entries(events)", Object.entries(events));
    Object.entries(events).forEach(([id, ev]) => {
      g[ev.row][ev.col].event = id;
    });
    return g;
  }, [events]);
  const handleOnClick = (hour, weekDay) => {
    setOpen(true);
    if (!grid[hour][weekDay].event) {
      const eventId = `t${nextIdRef.current++}`;
      setCurrentRow(hour);
      setCurrentCol(weekDay);
      // setGrid((prev) => {
      //   const clone = prev.map((row) => row.map((col) => ({ ...col })));
      //   clone[hour][weekDay].event = eventId;
      //   return clone;
      // });
      setEvent((event) => {
        const clone = { ...event };
        clone[eventId] = { activity: "new event", row: hour, col: weekDay };
        return clone;
      });
    } else {
      setCurrentRow(hour);
      setCurrentCol(weekDay);
    }
  };
  const handleEdit = (e) => {
    const eventId = grid[currentRow][currentCol].event;
    setEvent((event) => {
      const clone = { ...event };
      clone[eventId] = { ...clone[eventId], activity: e.target.value };
      return clone;
    });
  };

  const handleDelete = () => {
    const eventId = grid[currentRow][currentCol].event;

    // setGrid((prev) => {
    //   const clone = prev.map((row) => row.map((col) => ({ ...col })));
    //   clone[currentRow][currentCol] = {
    //     value: "",
    //     status: "enabled",
    //     event: "",
    //   };
    //   return clone;
    // });
    setEvent((event) => {
      const clone = { ...event };
      delete clone[eventId];
      return clone;
    });
    setCurrentRow(null);
    setCurrentCol(null);
    setOpen(false);
  };

  const value =
    currentRow === null || currentCol === null
      ? ""
      : events[grid[currentRow][currentCol].event]?.activity ?? "";
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="calendar" style={{ padding: 20 }}>
      <h1>Weekly Calendar</h1>

      <div className="pop-up">
        {open && (
          <form onSubmit={handleSubmit}>
            input event name
            <input value={value} onChange={handleEdit} />
            <button type="button" onClick={handleClose}>close</button>
            <button type="button" onClick={handleDelete}>delete</button>
          </form>
        )}
      </div>
      <table>
        <thead>
          <tr>
            {grid[0].map((day) => (
              <th>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.slice(1).map((hour, hourIndex) => {
            return (
              <tr>
                {hour.map((weekDay, weekDayIndex) => {
                  return (
                    <td
                      onClick={() => {
                        if (weekDay.status === "disabled") return;
                        handleOnClick(hourIndex + 1, weekDayIndex);
                      }}
                    >
                      {weekDayIndex === 0
                        ? weekDay.value
                        : events[weekDay.event]?.activity}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
