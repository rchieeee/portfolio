// Leaderboard Service: Local persistence with optional Firebase Cloud Sync

const LOCAL_STORAGE_PLAYER_KEY = 'archie_arcade_player_name'
const LOCAL_STORAGE_WINS_KEY = 'archie_arcade_player_wins'
const LOCAL_STORAGE_CACHE_KEY = 'archie_arcade_cached_leaderboard'

// Base contenders (clean, no dummy players)
export const BASE_LEADERBOARD = []

// Firebase Realtime Database URL
// Configured via .env or direct URL fallback
export const FIREBASE_DB_URL =
  import.meta.env.VITE_FIREBASE_DB_URL ||
  'https://archie-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app'

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
 * Fetch remote leaderboard from Firebase Realtime Database
 */
export async function fetchRemoteLeaderboard() {
  if (!FIREBASE_DB_URL) return null

  try {
    const cleanUrl = FIREBASE_DB_URL.replace(/\/$/, '')
    const res = await fetch(`${cleanUrl}/leaderboard.json`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || typeof data !== 'object') return null

    // Firebase returns an object with keys: { [key]: { name, wins, diff, updatedAt } }
    const list = Object.entries(data).map(([key, val]) => ({
      id: key,
      name: val.name || 'Anonymous',
      wins: typeof val.wins === 'number' ? val.wins : parseInt(val.wins, 10) || 0,
      diff: val.diff || 'Balanced',
      updatedAt: val.updatedAt || 0,
    }))

    // Save to local cache
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }

    return list
  } catch {
    return null
  }
}

/**
 * Sync player win to Firebase Realtime Database
 */
export async function syncWinToFirebase(playerName, newWins, difficulty = 'Balanced') {
  if (!FIREBASE_DB_URL || !playerName?.trim()) return

  try {
    const cleanUrl = FIREBASE_DB_URL.replace(/\/$/, '')
    // Sanitize key for Firebase (no ., $, #, [, ], /)
    const safeKey = playerName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 24)

    // Check existing remote record first to avoid overwriting a higher score
    let targetWins = newWins
    try {
      const checkRes = await fetch(`${cleanUrl}/leaderboard/${safeKey}.json`)
      if (checkRes.ok) {
        const existing = await checkRes.json()
        if (existing && typeof existing.wins === 'number') {
          targetWins = Math.max(existing.wins + 1, newWins)
        }
      }
    } catch {
      // ignore check error
    }

    await fetch(`${cleanUrl}/leaderboard/${safeKey}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: playerName.trim(),
        wins: targetWins,
        diff: difficulty,
        updatedAt: Date.now(),
      }),
    })
  } catch {
    // Fail silently without blocking gameplay
  }
}

/**
 * Get sorted leaderboard combining real remote records and current visitor
 */
export function getCombinedLeaderboard(
  currentPlayerName,
  currentPlayerWins,
  difficulty = 'Balanced',
  remoteList = null
) {
  const cleanName = currentPlayerName?.trim() || ''
  const list = (remoteList && remoteList.length > 0) ? [...remoteList] : []

  if (cleanName) {
    const existingIdx = list.findIndex(
      (item) => item.name.toLowerCase() === cleanName.toLowerCase()
    )

    if (existingIdx >= 0) {
      list[existingIdx] = {
        ...list[existingIdx],
        wins: Math.max(list[existingIdx].wins, currentPlayerWins || 0),
        isCurrent: true,
      }
    } else {
      list.push({
        id: 'current_visitor',
        name: cleanName,
        wins: currentPlayerWins || 0,
        diff: difficulty,
        isCurrent: true,
      })
    }
  }

  return list.sort((a, b) => b.wins - a.wins)
}
