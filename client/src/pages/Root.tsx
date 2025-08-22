import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet, base, polygon, arbitrum, optimism } from 'wagmi/chains'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

const wagmiConfig = createConfig(getDefaultConfig({
  appName: 'zkEngagement',
  projectId,
  chains: [mainnet, base, polygon, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(), [base.id]: http(), [polygon.id]: http(),
    [arbitrum.id]: http(), [optimism.id]: http()
  },
  ssr: false
}))

export default function Root() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Shell />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Shell() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => (localStorage.getItem('theme') as any) || 'dark')
  const [user, setUser] = useState<any>(null)
  const nav = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/api/auth/x/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(u => u && setUser(u))
      .catch(() => {})
  }, [])

  const loginX = () => window.location.href = '/api/auth/x/login'
  const logoutX = async () => { await fetch('/api/auth/x/logout', { credentials: 'include' }); setUser(null); nav('/') }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/" className="text-xl font-semibold tracking-wide">zkEngagement</Link>
        <div className="flex items-center gap-2">
          <ConnectButton showBalance={false} chainStatus="icon" />
          {!user ? (
            <button onClick={loginX} className="px-3 py-1.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white">Sign in with X</button>
          ) : (
            <button onClick={logoutX} className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">Logout @{user.handle}</button>
          )}
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
      <main className="px-6 py-8 max-w-6xl mx-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}
