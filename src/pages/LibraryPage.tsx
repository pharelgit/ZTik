import { useState, useEffect, useCallback } from 'react'
import { Search, Library, SortDesc, SortAsc } from 'lucide-react'
import { VideoInfo } from '../types'
import { getLibrary, removeFromLibrary, searchLibrary } from '../services/storage'
import VideoCard from '../components/VideoCard'

export default function LibraryPage() {
  const [videos, setVideos] = useState<VideoInfo[]>([])
  const [query, setQuery] = useState('')
  const [sortAsc, setSortAsc] = useState(false)

  const refresh = useCallback(() => {
    const lib = query ? searchLibrary(query) : getLibrary()
    setVideos(sortAsc ? [...lib].reverse() : lib)
  }, [query, sortAsc])

  useEffect(() => { refresh() }, [refresh])

  const handleDelete = (id: string) => {
    removeFromLibrary(id)
    refresh()
  }

  return (
    <div className="min-h-screen pt-8 pb-28 md:pt-24 md:pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl tracking-tight">Bibliothèque</h1>
            <p className="text-gray-400 text-sm mt-0.5 font-mono">
              {videos.length} vidéo{videos.length !== 1 ? 's' : ''} sauvegardée{videos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setSortAsc(p => !p)}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-tik-muted hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Inverser le tri"
          >
            {sortAsc ? <SortAsc size={18} className="text-gray-400" /> : <SortDesc size={18} className="text-gray-400" />}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une vidéo ou un auteur…"
            className="input-field pl-10"
          />
        </div>

        {/* Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-tik-muted flex items-center justify-center mb-4">
              <Library size={28} className="text-gray-400" />
            </div>
            <p className="font-display font-semibold text-lg mb-1">
              {query ? 'Aucun résultat' : 'Bibliothèque vide'}
            </p>
            <p className="text-sm text-gray-400">
              {query ? 'Essaie avec d\'autres mots-clés' : 'Télécharge des vidéos pour les retrouver ici'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
