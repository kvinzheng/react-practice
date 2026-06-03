import { useState } from "react";
import "./App.css";

const INITIAL_BOARD = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { title: "Add new card creation" },
      { title: "Write documentation" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [
      { title: "Design board layout" },
      { title: "Implement keyboard movement" },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [{ title: "Review PR #42" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ title: "Set up project" }],
  },
];

function App() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [activeCell, setActiveCell] = useState(null); // { colIndex, value } | null

  const moveCard = (colIndex, cardIndex, direction) => {
    // TODO: implement move logic
    setBoard((prev) => {
      const clone = prev.map((ele) => {
        return {
          ...ele,
          cards: ele.cards.map((card) => ({ ...card })),
        };
      });
      if (direction === "up") {
        if (cardIndex === 0) return prev;
        const cards = clone[colIndex].cards;
        [cards[cardIndex - 1], cards[cardIndex]] = [
          cards[cardIndex],
          cards[cardIndex - 1],
        ];
      }
      if (direction === "down") {
        if (cardIndex === clone[colIndex].cards.length - 1) return prev;
        const cards = clone[colIndex].cards;
        [cards[cardIndex + 1], cards[cardIndex]] = [
          cards[cardIndex],
          cards[cardIndex + 1],
        ];
      }

      if (direction === "left") {
        if (colIndex === 0) return prev;

        const [card] = clone[colIndex].cards.splice(cardIndex, 1);
        clone[colIndex - 1].cards.push(card);
        return clone;
      }

      if (direction === "right") {
        if (colIndex === clone.length - 1) return prev;

        const [card] = clone[colIndex].cards.splice(cardIndex, 1);
        clone[colIndex + 1].cards.push(card);
        return clone;
      }
    });
  };

  const deleteCard = (colIndex, cardIndex) => {
    // TODO: implement delete card logic
  };

  const addCard = () => {
    // TODO: implement add card logic
    if (!activeCell) return;
    const title = activeCell.value.trim();
    setBoard((prev) => {
      return prev.map((col, i) => {
        if (i === activeCell.colIndex) {
          return { ...col, cards: [...col.cards, { title }] };
        }
        return col;
      });
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Jira Board</h1>
        <p className="hint">
          Use the arrow buttons on each card to move it between columns or
          reorder it within a column. Click × to delete.
        </p>
      </header>

      <div className="board">
        {board.map((col, colIndex) => (
          <div className="column" key={col.id}>
            <div className="column-header">
              <h2>{col.title}</h2>
              <span className="count">{col.cards.length}</span>
            </div>

            <div className="cards">
              {col.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="card">
                  <div className="card-title">{card.title}</div>
                  <div className="card-actions">
                    <button
                      type="button"
                      title="Move left"
                      disabled={colIndex === 0}
                      onClick={() => moveCard(colIndex, cardIndex, "left")}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      title="Move up"
                      disabled={cardIndex === 0}
                      onClick={() => moveCard(colIndex, cardIndex, "up")}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={cardIndex === col.cards.length - 1}
                      onClick={() => moveCard(colIndex, cardIndex, "down")}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      title="Move right"
                      disabled={colIndex === board.length - 1}
                      onClick={() => moveCard(colIndex, cardIndex, "right")}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className="delete"
                      title="Delete"
                      onClick={() => deleteCard(colIndex, cardIndex)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-card">
              {activeCell?.colIndex === colIndex ? (
                <>
                  <input
                    type="text"
                    placeholder="New task..."
                    autoFocus
                    value={activeCell.value}
                    onChange={(e) =>
                      setActiveCell({ ...activeCell, value: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCard();
                      } else if (e.key === "Escape") {
                        setActiveCell(null);
                      }
                    }}
                    onBlur={() => {
                      if (!activeCell.value.trim()) setActiveCell(null);
                    }}
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={addCard}
                  >
                    Add
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="add-toggle"
                  onClick={() => setActiveCell({ colIndex, value: "" })}
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
