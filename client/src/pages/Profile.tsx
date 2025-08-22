import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function Profile() {
  const { user }: any = useOutletContext()
  const [themePref, setThemePref] = useState<'light'|'dark'>(() => (localStorage.getItem('theme') as any) || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themePref === 'dark')
    localStorage.setItem('theme', themePref)
  }, [themePref])

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 max-w-xl">
      <div className="text-xl font-semibold">Profile & Settings</div>
      <div className="mt-4 space-y-3 text-sm">
        <div>Display: {user?.displayName || 'Anon'}</div>
        <div>Handle: {user?.handle ? '@' + user.handle : 'Not linked'}</div>
        <div className="flex items-center gap-2">
          <span>Theme:</span>
          <select value={themePref} onChange={e => setThemePref(e.target.value as any)} className="px-2 py-1 rounded bg-white/5 border border-white/10">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
    </div>
  )
}
