import React, { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, polygon, base, arbitrum, optimism } from 'wagmi/chains'
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { motion, AnimatePresence } from 'framer-motion'

const queryClient = new QueryClient()

// RainbowKit+WalletConnect config
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'
const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'DeFiQuest',
    projectId,
    chains: [mainnet, base, polygon, arbitrum, optimism],
    transports: {
      [mainnet.id]: http(),
      [base.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
    },
    ssr: false,
  })
)

type User = {
  id: number
  handle?: string
  displayName?: string
  pfpUrl?: string
  theme?: 'light' | 'dark'
}

export default function Root() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<'light'|'dark'>(() => (localStorage.getItem('theme') as any) || 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const loginWithX = async () => {
    // Kick off X OAuth2 (server handles redirect)
    window.location.href = '/api/auth/x/login'
  }

  const logoutX = async () => {
    await fetch('/api/auth/x/logout', { credentials: 'include' })
    setUser(null)
  }

  useEffect(() => {
    // Fetch current session user
    fetch('/api/auth/x/me', { credentials: 'include' }).then(async r => {
      if (r.ok) setUser(await r.json())
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide">DeFiQuest</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">zkEngagement</span>
        </div>
        <div className="flex items-center gap-3">
          <ConnectButton showBalance={false} chainStatus="icon" />
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {!user ? (
            <button onClick={loginWithX} className="px-3 py-1.5 rounded-2xl bg-blue-500 hover:bg-blue-600 transition text-white">Sign in with X</button>
          ) : (
            <button onClick={logoutX} className="px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition">Logout {user.handle ? `@${user.handle}` : ''}</button>
          )}
        </div>
      </nav>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.section
            key="hero"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
              <h1 className="text-2xl font-semibold">Prove your social impact, privately.</h1>
              <p className="mt-2 text-sm text-slate-300">Link your X account, fetch engagement, and mint zk-verified badges. No doxxing—just proofs.</p>
              <div className="mt-4 flex gap-3">
                <ConnectButton />
                <button onClick={loginWithX} className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition text-white">Connect X</button>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
              <ProfileCard user={user} />
            </div>
          </motion.section>

          <motion.section
            key="actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="grid md:grid-cols-3 gap-6 mt-6"
          >
            <Callout title="zkVerify" desc="Generate zero-knowledge proofs of engagement." action="Generate Proof" onClick={() => fetch('/api/zk/engagement/prove', { credentials: 'include' })} />
            <Callout title="Relayer" desc="Submit meta-tx via relayer." action="Relay Tx" onClick={() => fetch('/api/relay/tx', { method: 'POST', credentials: 'include' })} />
            <Callout title="Yap" desc="Join the on-chain chat." action="Open Chat" onClick={() => document.getElementById('yap')?.scrollIntoView({ behavior: 'smooth' })} />
          </motion.section>

          <motion.section id="yap" key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="mt-8">
            <ChatBox />
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  )
}

function ProfileCard({ user }: { user: any }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {user?.pfpUrl ? <img src={user.pfpUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-2xl">🛡️</div>}
      </div>
      <div>
        <div className="font-semibold">{user?.displayName || 'Anon'}</div>
        <div className="text-sm text-slate-400">{user?.handle ? '@' + user.handle : 'Connect X to sync PFP'}</div>
      </div>
    </div>
  )
}

function Callout({ title, desc, action, onClick }: { title: string, desc: string, action: string, onClick: () => void }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-slate-300 mt-1">{desc}</div>
      <button onClick={onClick} className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">{action}</button>
    </div>
  )
}

function ChatBox() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [msgs, setMsgs] = useState<string[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const socket = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/yap')
    socket.onmessage = (e) => setMsgs(m => [...m.slice(-99), e.data])
    setWs(socket)
    return () => socket.close()
  }, [])

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
      <div className="font-semibold mb-2">Yapping</div>
      <div className="h-48 overflow-y-auto space-y-1 text-sm">
        {msgs.map((m, i) => <div key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10">{m}</div>)}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Say something…" className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 outline-none" />
        <button onClick={() => { ws?.send(input); setInput('') }} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">Yap</button>
      </div>
    </div>
  )
}