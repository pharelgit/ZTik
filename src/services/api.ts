import axios from 'axios'
import { TikwmResponse, VideoInfo } from '../types'

const TIKWM_API = 'https://www.tikwm.com/api/'

export async function fetchTikTokVideo(url: string): Promise<VideoInfo> {
  const params = new URLSearchParams()
  params.append('url', url)
  params.append('count', '12')
  params.append('cursor', '0')
  params.append('web', '1')
  params.append('hd', '1')

  const response = await axios.post<TikwmResponse>(TIKWM_API, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  const { code, msg, data } = response.data

  if (code !== 0 || !data) {
    throw new Error(msg || 'Impossible de récupérer la vidéo')
  }

  return {
    id: data.id,
    title: data.title || 'Vidéo TikTok',
    author: data.author?.nickname || data.author?.unique_id || 'Inconnu',
    authorId: data.author?.unique_id || '',
    thumbnail: data.cover,
    videoUrl: data.play,
    duration: data.duration || 0,
    likes: data.digg_count || 0,
    views: data.play_count || 0,
    downloadedAt: new Date().toISOString(),
  }
}

export function isValidTikTokUrl(url: string): boolean {
  return /tiktok\.com\/.+\/video\/\d+|vm\.tiktok\.com\/\w+|vt\.tiktok\.com\/\w+/.test(url)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
