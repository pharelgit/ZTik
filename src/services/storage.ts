import { VideoInfo } from '../types'

const KEY = 'tiksave_library'

export function getLibrary(): VideoInfo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToLibrary(video: VideoInfo): void {
  const lib = getLibrary()
  const exists = lib.find(v => v.id === video.id)
  if (!exists) {
    localStorage.setItem(KEY, JSON.stringify([video, ...lib]))
  }
}

export function removeFromLibrary(id: string): void {
  const lib = getLibrary().filter(v => v.id !== id)
  localStorage.setItem(KEY, JSON.stringify(lib))
}

export function clearLibrary(): void {
  localStorage.removeItem(KEY)
}

export function searchLibrary(query: string): VideoInfo[] {
  const q = query.toLowerCase()
  return getLibrary().filter(
    v => v.title.toLowerCase().includes(q) || v.author.toLowerCase().includes(q)
  )
}
