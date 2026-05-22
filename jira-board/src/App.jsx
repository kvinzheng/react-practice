import { useRef, useState } from 'react'
import './App.css'

const INITIAL_BOARD = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 4, title: 'Add new card creation' },
      { id: 5, title: 'Write documentation' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      { id: 2, title: 'Design board layout' },
      { id: 3, title: 'Implement keyboard movement' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    cards: [{ id: 6, title: 'Review PR #42' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 1, title: 'Set up project' }],
  },
]

function App() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [activeCell, setActiveCell] = useState(null) // { colId, value } | null
  const nextIdRef = useRef(100)

  const moveCard = (colIndex, cardIndex, direction) => {
    setBoard((prev) => {
      const next = prev.map((col) => ({ ...col, cards: [...col.cards] }))

      if (direction === 'up' || direction === 'down') {
        const swapIdx = cardIndex + (direction === 'down' ? 1 : -1)
        const cards = next[colIndex].cards
        if (swapIdx < 0 || swapIdx >= cards.length) return prev
        ;[cards[cardIndex], cards[swapIdx]] = [cards[swapIdx], cards[cardIndex]]
        return next
      }

      if (direction === 'left' || direction === 'right') {
        const newColIndex = colIndex + (direction === 'right' ? 1 : -1)
        if (newColIndex < 0 || newColIndex >= next.length) return prev
        const [card] = next[colIndex].cards.splice(cardIndex, 1)
        next[newColIndex].cards.push(card)
        return next
      }

      return prev
    })
  }

  const deleteCard = (colIndex, cardIndex) => {
    setBoard((prev) =>
      prev.map((col, i) =>
        i === colIndex
          ? { ...col, cards: col.cards.filter((_, j) => j !== cardIndex) }
          : col
      )
    )
  }

  const addCard = () => {
    if (!activeCell) return
    const title = activeCell.value.trim()
    if (!title) {
      setActiveCell(null)
      return
    }
    const id = nextIdRef.current++
    setBoard((prev) =>
      prev.map((col) =>
        col.id === activeCell.colId
          ? { ...col, cards: [...col.cards, { id, title }] }
          : col
      )
    )
    setActiveCell({ colId: activeCell.colId, value: '' })
  }

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
                <div key={card.id} className="card">
                  <div className="card-title">{card.title}</div>
                  <div className="card-actions">
                    <button
                      type="button"
                      title="Move left"
                      disabled={colIndex === 0}
                      onClick={() => moveCard(colIndex, cardIndex, 'left')}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      title="Move up"
                      disabled={cardIndex === 0}
                      onClick={() => moveCard(colIndex, cardIndex, 'up')}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      title="Move down"
                      disabled={cardIndex === col.cards.length - 1}
                      onClick={() => moveCard(colIndex, cardIndex, 'down')}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      title="Move right"
                      disabled={colIndex === board.length - 1}
                      onClick={() => moveCard(colIndex, cardIndex, 'right')}
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
              {activeCell?.colId === col.id ? (
                <>
                  <input
                    type="text"
                    placeholder="New task..."
                    autoFocus
                    value={activeCell.value}
                    onChange={(e) =>
                      setActiveCell({ colId: col.id, value: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCard()
                      } else if (e.key === 'Escape') {
                        setActiveCell(null)
                      }
                    }}
                    onBlur={() => {
                      if (!activeCell.value.trim()) setActiveCell(null)
                    }}
                  />
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={addCard}>
                    Add
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="add-toggle"
                  onClick={() => setActiveCell({ colId: col.id, value: '' })}
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
