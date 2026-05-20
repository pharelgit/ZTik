import { useState, useRef } from 'react'
import { Download, Link, AlertCircle, CheckCircle, Heart, Eye, Clock, Clipboard } from 'lucide-react'
import { fetchTikTokVideo, isValidTikTokUrl, formatNumber, formatDuration } from '../services/api'
import { addToLibrary } from '../services/storage'
import { VideoInfo, DownloadStatus } from '../types'
import clsx from 'clsx'

export default function DownloadPage() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [error, setError] = useState('')
  const [video, setVideo] = useState<VideoInfo | null>(null)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    setUrl(text)
    inputRef.current?.focus()
  }

  const handleFetch = async () => {
    if (!url.trim()) return
    if (!isValidTikTokUrl(url)) {
      setError('Lien TikTok invalide. Vérifiez l\'URL.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')
    setVideo(null)
    setSaved(false)

    try {
      const info = await fetchTikTokVideo(url)
      setVideo(info)
      setStatus('success')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la récupération')
      setStatus('error')
    }
  }

  const handleDownload = () => {
    if (!video) return
    addToLibrary(video)
    setSaved(true)
    const a = document.createElement('a')
    a.href = video.videoUrl
    a.download = `${video.author}_${video.id}.mp4`
    a.target = '_blank'
    a.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFetch()
  }

  return (
    <div className="min-h-screen pt-8 pb-28 md:pt-24 md:pb-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-tik-red/10 border border-tik-red/20 rounded-full px-4 py-1.5 mb-5">
            <div className="w-2 h-2 bg-tik-red rounded-full animate-pulse" />
            <span className="text-tik-red text-xs font-mono font-medium">Sans watermark</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
            Télécharge tes<br />
            <span className="text-tik-red">vidéos TikTok</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-body text-lg">
            Colle un lien, récupère ta vidéo. Simple.
          </p>
        </div>

        {/* Input Card */}
        <div className="card p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
            Lien TikTok
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setStatus('idle') }}
                onKeyDown={handleKeyDown}
                placeholder="https://www.tiktok.com/@user/video/..."
                className="input-field pl-9 pr-4"
              />
            </div>
            <button
              onClick={handlePaste}
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-tik-muted hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              title="Coller"
            >
              <Clipboard size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <button
            onClick={handleFetch}
            disabled={status === 'loading' || !url.trim()}
            className={clsx(
              'w-full mt-3 btn-primary flex items-center justify-center gap-2 py-3.5',
              (status === 'loading' || !url.trim()) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Récupération en cours…
              </>
            ) : (
              <>
                <Download size={18} />
                Récupérer la vidéo
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 animate-fade-in">
            <AlertCircle size={18} className="text-tik-red mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-display font-semibold text-tik-red">Erreur</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Video Preview */}
        {status === 'success' && video && (
          <div className="card overflow-hidden animate-slide-up">
            <div className="flex gap-4 p-5">
              {/* Thumbnail */}
              <div className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-tik-muted">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {video.duration > 0 && (
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock size={8} />
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm line-clamp-3 mb-2 dark:text-white">
                  {video.title}
                </p>
                <p className="text-tik-red text-xs font-mono mb-3">@{video.authorId || video.author}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
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
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="px-5 pb-5">
              <button
                onClick={handleDownload}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-sm transition-all duration-200',
                  saved
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                    : 'btn-primary animate-pulse-red'
                )}
              >
                {saved ? (
                  <>
                    <CheckCircle size={18} />
                    Téléchargé et sauvegardé !
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Télécharger la vidéo
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        {status === 'idle' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
            {[
              { icon: '📋', title: 'Colle le lien', desc: 'Depuis TikTok, copie le lien de partage' },
              { icon: '⚡', title: 'Récupération', desc: 'On extrait la vidéo en quelques secondes' },
              { icon: '💾', title: 'Téléchargement', desc: 'La vidéo est sauvegardée sur ton appareil' },
            ].map((tip, i) => (
              <div key={i} className="card p-4 text-center">
                <div className="text-2xl mb-2">{tip.icon}</div>
                <p className="font-display font-semibold text-sm mb-1">{tip.title}</p>
                <p className="text-xs text-gray-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
