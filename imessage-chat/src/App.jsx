import { useState, useRef, useEffect } from 'react'
import './App.css'

const INITIAL_MESSAGES = [
  { id: 1, type: 'sent', text: '晚上一起吃飯嗎', faded: true },
  { id: 2, type: 'sent', text: '在家', faded: true },
  { id: 3, type: 'sent', text: '我晚点买点 sashimi', dateLabel: 'Sunday 12:50 PM' },
  { id: 4, type: 'tapback', emoji: '👍', target: 3 },
  { id: 5, type: 'sent', text: '我跟你妈说了节日快乐', dateLabel: 'Yesterday 11:39 AM' },
  { id: 6, type: 'sent', text: '你晚上要一起吃飯不', dateLabel: 'Yesterday 2:43 PM' },
  { id: 7, type: 'sent', text: '?', dateLabel: 'Yesterday 4:38 PM' },
  { id: 8, type: 'sent', text: '去吃烤肉吗' },
  { id: 9, type: 'sent', text: '还是日料', dateLabel: 'Yesterday 6:03 PM' },
  { id: 10, type: 'sent', text: '你晚上還吃嗎還是算了', dateLabel: 'Today 11:47 AM' },
  { id: 11, type: 'sent', text: '我去健身' },
  { id: 12, type: 'sent', text: '你想吃飯的話我們可以晚上出去吃' },
  { id: 13, type: 'sent', text: '你不回我就當你不感興趣了', delivered: true },
]

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => {
      const cleared = prev.map(m => ({ ...m, delivered: false }))
      return [
        ...cleared,
        { id: Date.now(), type: 'sent', text, delivered: true },
      ]
    })
    setInput('')
  }

  return (
    <div className="phone">
      <div className="status-bar">
        <span className="time">4:56</span>
        <span className="status-icons">
          <span className="bars">●●●○</span>
          <span className="wifi">📶</span>
          <span className="battery">50</span>
        </span>
      </div>

      <div className="nav-bar">
        <div className="back">
          <span className="chevron">‹</span>
          <span className="badge">1</span>
        </div>
        <div className="contact">
          <div className="avatar">LC</div>
          <div className="name">Lily ›</div>
        </div>
        <div className="facetime">📹</div>
      </div>

      <div className="messages" ref={scrollRef}>
        <div className="date-header">Fri, May 8 at 12:47 PM</div>
        {messages.map((m, idx) => {
          if (m.type === 'tapback') return null
          const tapback = messages.find(t => t.type === 'tapback' && t.target === m.id)
          return (
            <div key={m.id}>
              {m.dateLabel && <div className="date-header">{m.dateLabel}</div>}
              <div className={`bubble-row ${m.type} ${m.faded ? 'faded' : ''}`}>
                <div className="bubble">
                  {tapback && <div className="tapback">{tapback.emoji}</div>}
                  {m.text}
                </div>
              </div>
              {m.delivered && idx === messages.length - 1 && (
                <div className="delivered">Delivered</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="composer">
        <button className="plus">+</button>
        <div className="input-wrap">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="iMessage"
          />
          <span className="mic">🎙️</span>
        </div>
      </div>
    </div>
  )
}
