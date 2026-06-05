import "./index.css";
import { useState } from "react";
const JIRA_BOARD = [
  {
    title: "backlog",
    events: [{ name: "tasks1" }, { name: "tasks2" }],
  },
  {
    title: "in progress",
    events: [{ name: "tasks3" }, { name: "tasks4" }],
  },
];

export default function App() {
  const [board, setBoard] = useState(JIRA_BOARD);

  const handleUp = (taskIndex, colIndex, task) => {
    console.log("colIndex", colIndex);

    if (colIndex === 0) return;
    setBoard((prev) => {
      const clone = prev.map((row) => ({
        ...row,
        events: [...row.events.map((event) => ({ ...event }))],
      }));

      [
        clone[taskIndex].events[colIndex],
        clone[taskIndex].events[colIndex - 1],
      ] = [
        clone[taskIndex].events[colIndex - 1],
        clone[taskIndex].events[colIndex],
      ];
      return clone;
    });
  };
  const handleDown = (taskIndex, colIndex, task) => {
    if (colIndex === task.events.length - 1) return;
    setBoard((prev) => {
      const clone = prev.map((row) => ({
        ...row,
        events: [...row.events.map((event) => ({ ...event }))],
      }));

      [
        clone[taskIndex].events[colIndex],
        clone[taskIndex].events[colIndex + 1],
      ] = [
        clone[taskIndex].events[colIndex + 1],
        clone[taskIndex].events[colIndex],
      ];
      return clone;
    });
  };
  const handleLeft = (taskIndex, colIndex) => {
    if (taskIndex === 0) return;
    setBoard((prev) => {
      const clone = prev.map((row) => ({
        ...row,
        events: [...row.events.map((event) => ({ ...event }))],
      }));

      [
        clone[taskIndex].events[colIndex],
        clone[taskIndex - 1].events[colIndex],
      ] = [
        clone[taskIndex - 1].events[colIndex],
        clone[taskIndex].events[colIndex],
      ];
      return clone;
    });
  };
  const handleRight = (taskIndex, colIndex, task) => {
    if (taskIndex === board.length - 1) return;
    setBoard((prev) => {
      const clone = prev.map((row) => ({
        ...row,
        events: [...row.events.map((event) => ({ ...event }))],
      }));

      [
        clone[taskIndex].events[colIndex],
        clone[taskIndex + 1].events[colIndex],
      ] = [
        clone[taskIndex + 1].events[colIndex],
        clone[taskIndex].events[colIndex],
      ];
      return clone;
    });
  };
  return (
    <div className="tasks">
      {board.map((task, taskIndex) => (
        <div>
          <div>title: {task.title}</div>

          {task.events.map((col, colIndex) => (
            <div className="wrap">
              {col.name}
              <button
                disabled={colIndex === 0}
                onClick={() => handleUp(taskIndex, colIndex, task)}
              >
                up
              </button>
              <button
                disabled={colIndex === task.events.length - 1}
                onClick={() => handleDown(taskIndex, colIndex, task)}
              >
                down
              </button>
              <button
                disabled={taskIndex === 0}
                onClick={() => handleLeft(taskIndex, colIndex, task)}
              >
                left
              </button>
              <button
                disabled={taskIndex === board.length - 1}
                onClick={() => handleRight(taskIndex, colIndex, task)}
              >
                right
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
