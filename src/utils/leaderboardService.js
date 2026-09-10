// Leaderboard Service: Local persistence with Cloud Sync architecture

const LOCAL_STORAGE_PLAYER_KEY = 'archie_arcade_player_name'
const LOCAL_STORAGE_WINS_KEY = 'archie_arcade_player_wins'

// Base hall of fame contenders
export const BASE_LEADERBOARD = [
  { id: 'arch_creator', name: 'Archie (Creator)', wins: 12, diff: 'Pro' },
  { id: 'kaban_dev', name: 'KabanDev', wins: 8, diff: 'Balanced' },
  { id: 'byte_striker', name: 'ByteStriker', wins: 4, diff: 'Balanced' },
  { id: 'guest_88', name: 'Guest_88', wins: 2, diff: 'Casual' },
]

/**
 * Get current stored player name
 */
export function getStoredPlayerName() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PLAYER_KEY)
    return saved && saved.trim() && saved !== 'Visitor' ? saved.trim() : ''
  } catch {
    return ''
  }
}

/**
 * Save player name
 */
export function savePlayerName(name) {
  try {
    const clean = name.slice(0, 18).trim()
    localStorage.setItem(LOCAL_STORAGE_PLAYER_KEY, clean)
  } catch {
    // ignore
  }
}

/**
 * Get current player's wins against Archie AI
 */
export function getStoredPlayerWins() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_WINS_KEY)
    const parsed = parseInt(saved, 10)
    return !isNaN(parsed) && parsed >= 0 ? parsed : 0
  } catch {
    return 0
  }
}

/**
 * Increment player wins against Archie AI
 */
export function incrementPlayerWins() {
  try {
    const current = getStoredPlayerWins()
    const next = current + 1
    localStorage.setItem(LOCAL_STORAGE_WINS_KEY, next.toString())
    return next
  } catch {
    return 1
  }
}

/**
 * Get sorted leaderboard combining base records and current visitor
 */
export function getCombinedLeaderboard(currentPlayerName, currentPlayerWins, difficulty = 'Balanced') {
  const cleanName = currentPlayerName?.trim() || ''

  const visitorEntry = {
    id: 'current_visitor',
    name: cleanName || 'You',
    wins: currentPlayerWins || 0,
    diff: difficulty,
    isCurrent: true,
  }

  // Filter out duplicate if user entered 'Archie (Creator)'
  const filteredBase = BASE_LEADERBOARD.filter(
    (item) => item.name.toLowerCase() !== cleanName.toLowerCase()
  )

  const combined = [...filteredBase, visitorEntry]
  return combined.sort((a, b) => b.wins - a.wins)
}
