export interface VideoInfo {
  id: string
  title: string
  author: string
  authorId: string
  thumbnail: string
  videoUrl: string
  duration: number
  likes: number
  views: number
  downloadedAt: string
}

export interface TikwmResponse {
  code: number
  msg: string
  data: {
    id: string
    title: string
    author: {
      id: string
      unique_id: string
      nickname: string
      avatar: string
    }
    cover: string
    play: string
    wmplay: string
    duration: number
    digg_count: number
    play_count: number
  }
}

export type DownloadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AppSettings {
  darkMode: boolean
  noWatermark: boolean
}
