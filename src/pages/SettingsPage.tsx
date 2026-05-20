import { useState } from 'react'
import { Moon, Sun, Trash2, HardDrive, Info, Shield, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { clearLibrary, getLibrary } from '../services/storage'
import clsx from 'clsx'

export default function SettingsPage() {
  const { dark, toggleDark } = useTheme()
  const [cleared, setCleared] = useState(false)
  const libSize = getLibrary().length

  const handleClear = () => {
    if (window.confirm(`Supprimer les ${libSize} vidéos de la bibliothèque ?`)) {
      clearLibrary()
      setCleared(true)
      setTimeout(() => setCleared(false), 3000)
    }
  }

  return (
    <div className="min-h-screen pt-8 pb-28 md:pt-24 md:pb-12 px-4">
      <div className="max-w-xl mx-auto">

        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-8">Paramètres</h1>

        {/* Apparence */}
        <Section title="Apparence">
          <SettingRow
            icon={dark ? <Moon size={18} /> : <Sun size={18} />}
            label="Mode sombre"
            action={
              <button
                onClick={toggleDark}
                className={clsx(
                  'relative w-12 h-6 rounded-full transition-colors duration-300',
                  dark ? 'bg-tik-red' : 'bg-gray-300'
                )}
              >
                <span
                  className={clsx(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
                    dark ? 'translate-x-6' : 'translate-x-0.5'
                  )}
                />
              </button>
            }
          />
        </Section>

        {/* Stockage */}
        <Section title="Stockage">
          <SettingRow
            icon={<HardDrive size={18} />}
            label="Vidéos sauvegardées"
            value={`${libSize} vidéo${libSize !== 1 ? 's' : ''}`}
          />
          <SettingRow
            icon={<Trash2 size={18} className={cleared ? 'text-green-400' : 'text-tik-red'} />}
            label={cleared ? 'Bibliothèque vidée !' : 'Vider la bibliothèque'}
            action={
              <button
                onClick={handleClear}
                disabled={libSize === 0 || cleared}
                className={clsx(
                  'text-xs font-mono px-3 py-1.5 rounded-lg transition-colors',
                  cleared
                    ? 'bg-green-500/20 text-green-400'
                    : libSize === 0
                    ? 'bg-gray-100 dark:bg-tik-muted text-gray-400 cursor-not-allowed'
                    : 'bg-tik-red/10 text-tik-red hover:bg-tik-red/20'
                )}
              >
                {cleared ? '✓ Vidé' : 'Supprimer tout'}
              </button>
            }
          />
        </Section>

        {/* À propos */}
        <Section title="À propos">
          <SettingRow
            icon={<Info size={18} />}
            label="Version"
            value="1.0.0"
          />
          <SettingRow
            icon={<Shield size={18} />}
            label="Politique de confidentialité"
            action={<ChevronRight size={16} className="text-gray-400" />}
          />
        </Section>

        <p className="text-center text-xs text-gray-400 font-mono mt-8">
          TikSave · Usage personnel uniquement
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 px-1">{title}</h2>
      <div className="card divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function SettingRow({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="text-gray-500 dark:text-gray-400 shrink-0">{icon}</div>
      <span className="flex-1 text-sm font-body">{label}</span>
      {value && <span className="text-sm text-gray-400 font-mono">{value}</span>}
      {action}
    </div>
  )
}
