import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

const INITIAL_BOARD = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: 4, title: "add new card creation" },
      { id: 5, title: "write documentation" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [
      { id: 2, title: "Design board layout" },
      { id: 3, title: "Implement keyboard movement" },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [{ id: 6, title: "Review PR #42" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: 1, title: "Set up project" }],
  },
];

function App() {
  const [bard, setBoard] = useState(INITIAL_BOARD);
  const [inputs, setInputs] = useState({});

  const addCard = (colId) => {
    const title = inputs[colId].trim();
    if(!title) return ;

    setBoard((prev) => {
      const newBoard = prev.map((col) => {
        console.log('col.id',col.id)
        console.log('colId',colId)
        if(col.id === colId) {
          return {
            ...col, cards:[...col.cards, {id: Date.now(), title}]
          }
        } else {
          return col
        }
      })
      return newBoard;
    })
  }

  const moveLeft = (colIndex, cardIndex) => {
    if (colIndex === 0) return;
    setBoard((prev) => {
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const card = next[colIndex].cards[cardIndex];
      next[colIndex].cards.splice(cardIndex, 1);
      next[colIndex - 1].cards.push(card);
      return next;
    });
  };

  const moveRight = (colIndex, cardIndex) => {
    setBoard((prev) => {
      if (colIndex === prev.length - 1) return prev;
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const card = next[colIndex].cards[cardIndex];
      next[colIndex].cards.splice(cardIndex, 1);
      next[colIndex + 1].cards.push(card);
      return next;
    });
  };

  const moveUp = (colIndex, cardIndex) => {
    if (cardIndex === 0) return;
    setBoard((prev) => {
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const cards = next[colIndex].cards;
      [cards[cardIndex], cards[cardIndex - 1]] = [cards[cardIndex - 1], cards[cardIndex]];
      return next;
    });
  };

  const moveDown = (colIndex, cardIndex) => {
    setBoard((prev) => {
      const cards = prev[colIndex].cards;
      if (cardIndex === cards.length - 1) return prev;
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
      const nextCards = next[colIndex].cards;
      [nextCards[cardIndex], nextCards[cardIndex + 1]] = [nextCards[cardIndex + 1], nextCards[cardIndex]];
      return next;
    });
  };

  return (
    <div>
      <div className="board">
        {bard.map((col, colIndex) => {
          return (
            <div key={col.id} className="column">
              <div className="column-header">
                <h2>{col.title}</h2>
                <span className="count">{col.cards.length}</span>
              </div>
              <div className="card-list">
                {col.cards.map((card, cardIndex) => {
                  return (
                    <div key={card.id} className="card">
                      <div className="card-title">{card.title}</div>
                      <div className="card-actions">
                        <button
                          onClick={() => moveLeft(colIndex, cardIndex)}
                          disabled={colIndex === 0}
                        >
                          left
                        </button>
                        <button
                          onClick={() => moveRight(colIndex, cardIndex)}
                          disabled={colIndex === bard.length - 1}
                        >
                          right
                        </button>
                        <button
                          onClick={() => moveUp(colIndex, cardIndex)}
                          disabled={cardIndex === 0}
                        >
                          up
                        </button>
                        <button
                          onClick={() => moveDown(colIndex, cardIndex)}
                          disabled={cardIndex === col.cards.length - 1}
                        >
                          down
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="add-card">
                <input
                  type="text"
                  placeholder="New task..."
                  value={inputs[col.id] || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [col.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCard(col.id);
                    }
                  }}
                />
                <button onClick={() => addCard(col.id)}>Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
