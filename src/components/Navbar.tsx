import { NavLink } from 'react-router-dom'
import { Download, Library, Settings } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      <div className="max-w-4xl mx-auto px-4">
        {/* Mobile bottom nav */}
        <div className="md:hidden flex items-center justify-around bg-white dark:bg-tik-gray border-t border-gray-200 dark:border-white/10 px-2 py-3">
          <MobileNavItem to="/" icon={<Download size={20} />} label="Télécharger" />
          <MobileNavItem to="/library" icon={<Library size={20} />} label="Bibliothèque" />
          <MobileNavItem to="/settings" icon={<Settings size={20} />} label="Paramètres" />
        </div>

        {/* Desktop top nav */}
        <div className="hidden md:flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tik-red rounded-lg flex items-center justify-center">
              <Download size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Tik<span className="text-tik-red">Save</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <DesktopNavItem to="/" icon={<Download size={16} />} label="Télécharger" />
            <DesktopNavItem to="/library" icon={<Library size={16} />} label="Bibliothèque" />
            <DesktopNavItem to="/settings" icon={<Settings size={16} />} label="Paramètres" />
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx('nav-link', isActive && 'active')
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

function DesktopNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-medium transition-all duration-200',
          isActive
            ? 'text-tik-red bg-tik-red/10'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
