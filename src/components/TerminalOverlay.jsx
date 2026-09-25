import { useEffect, useRef, useState } from 'react'
import { terminalCommands } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function TerminalOverlay({ isOpen, onClose, onLaunchGame }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', text: 'Archie Dev Terminal [v2.5.0]' },
    { type: 'system', text: 'Type "help" to view available commands or "play" to enter the Cyber Air Hockey arcade.' },
  ])
  const inputRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (e) => {
    e.preventDefault()
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return

    sounds.play('tick')
    const newHistory = [...history, { type: 'user', text: `$ ${input}` }]

    if (trimmed === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    if (trimmed === 'play' || trimmed === 'game' || trimmed === 'arcade') {
      newHistory.push({
        type: 'output',
        text: '[System] Launching Cyber Air Hockey Arcade...\nInitializing arena physics engine...',
      })
      sounds.play('chime')
      setHistory(newHistory)
      setInput('')
      setTimeout(() => {
        onLaunchGame?.()
      }, 600)
      return
    }

    if (terminalCommands[trimmed]) {
      newHistory.push({ type: 'output', text: terminalCommands[trimmed] })
    } else {
      newHistory.push({
        type: 'error',
        text: `Command not found: "${trimmed}". Type "help" or "play" for valid commands.`,
      })
      sounds.play('droplet')
    }

    setHistory(newHistory)
    setInput('')
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Terminal Window Frame (Mobile Responsive max-h) */}
      <div className="relative z-10 flex h-[480px] max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl ios-glass-card p-5 text-gray-200 shadow-2xl overflow-hidden">
        {/* Apple iOS Physical Specular Top Rim */}
        <div className="specular-rim" />

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white/40 cursor-pointer hover:bg-white transition-colors" onClick={onClose} title="Close" />
            <span className="ml-2 font-mono text-xs text-gray-300">
              archie@lupon-davao: ~ (cli)
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
            <button
              type="button"
              onClick={() => {
                sounds.play('chime')
                onLaunchGame?.()
              }}
              className="ios-glass-pill rounded-lg px-2.5 py-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              ▶ play arcade
            </button>
            <span>Esc to close</span>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="flex-1 overflow-y-auto py-3 font-mono text-[12.5px] leading-relaxed">
          {history.map((item, i) => (
            <div
              key={i}
              className={`mb-2 whitespace-pre-wrap ${
                item.type === 'user'
                  ? 'font-bold text-white'
                  : item.type === 'error'
                  ? 'text-gray-400 italic'
                  : item.type === 'system'
                  ? 'text-gray-500'
                  : 'text-gray-300'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt Row */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-gray-800 pt-3">
          <span className="font-mono text-xs font-bold text-white">
            visitor@archie:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type play, help, projects, stack..."
            className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-gray-600 focus:outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}
