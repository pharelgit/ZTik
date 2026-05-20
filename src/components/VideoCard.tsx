import { useState } from 'react'
import { Trash2, Share2, Play, Heart, Eye, Clock } from 'lucide-react'
import { VideoInfo } from '../types'
import { formatNumber, formatDuration } from '../services/api'

interface VideoCardProps {
  video: VideoInfo
  onDelete: (id: string) => void
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const [imgError, setImgError] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: video.title, url: video.videoUrl })
    } else {
      await navigator.clipboard.writeText(video.videoUrl)
      alert('Lien copié !')
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = video.videoUrl
    a.download = `${video.author}_${video.id}.mp4`
    a.target = '_blank'
    a.click()
  }

  const date = new Date(video.downloadedAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div
      className="card group relative overflow-hidden animate-fade-in"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] max-h-64 overflow-hidden rounded-t-2xl bg-tik-muted">
        {!imgError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={32} className="text-gray-500" />
          </div>
        )}

        {/* Duration badge */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock size={10} />
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-tik-dark/60 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleDownload}
            className="w-10 h-10 rounded-full bg-tik-red flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Play size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-display font-medium line-clamp-2 mb-1 dark:text-white text-gray-900">
          {video.title}
        </p>
        <p className="text-xs text-tik-red font-mono mb-2">@{video.authorId || video.author}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {video.likes > 0 && (
            <span className="flex items-center gap-1">
              <Heart size={10} className="text-tik-red" />
              {formatNumber(video.likes)}
            </span>
          )}
          {video.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={10} />
              {formatNumber(video.views)}
            </span>
          )}
          <span className="ml-auto">{date}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
          >
            <Play size={14} />
            Ouvrir
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-tik-muted hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <Share2 size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-tik-muted hover:bg-red-500/20 flex items-center justify-center transition-colors group/del"
          >
            <Trash2 size={14} className="text-gray-500 dark:text-gray-400 group-hover/del:text-tik-red transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}
