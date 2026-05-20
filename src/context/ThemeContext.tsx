import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface ThemeContextType {
  dark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextType>({ dark: true, toggleDark: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('tiksave_dark')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('tiksave_dark', JSON.stringify(dark))
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(p => !p) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
