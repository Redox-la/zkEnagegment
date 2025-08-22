import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'

export default function Dashboard() {
  const { user }: any = useOutletContext()
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold">Actions</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <Callout title="zkVerify" desc="Generate ZK proof of engagement." action="Generate Proof" onClick={prove} />
            <Callout title="Relayer" desc="Send meta-tx via relayer." action="Relay Tx" onClick={relay} />
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
          <ProfileCard user={user} />
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="mt-8">
        <ChatBox />
      </motion.section>
    </>
  )
}

function Callout({ title, desc, action, onClick }: { title: string; desc: string; action: string; onClick: () => void }) {
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-300 mt-1">{desc}</div>
      <button onClick={onClick} className="mt-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">{action}</button>
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

async function prove() {
  const r = await fetch('/api/zk/engagement/prove', { method: 'POST', credentials: 'include' })
  const j = await r.json().catch(() => ({}))
  alert('Proof: ' + (j.proofId || 'mock'))
}

async function relay() {
  const r = await fetch('/api/relay/tx', { method: 'POST', credentials: 'include' })
  const j = await r.json().catch(() => ({}))
  alert(j.relayed ? 'Relayed!' : 'Failed')
}

function ChatBox() {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [msgs, setMsgs] = useState<string[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = new WebSocket((location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/yap')
    socket.onmessage = (e) => setMsgs(m => [...m.slice(-99), e.data as string])
    setWs(socket)
    return () => socket.close()
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [msgs.length])

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
      <div className="font-semibold mb-2">Yapping</div>
      <div ref={listRef} className="h-52 overflow-y-auto space-y-1 text-sm">
        {msgs.map((m, i) => <div key={i} className="px-2 py-1 rounded bg-white/5 border border-white/10">{m}</div>)}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Say something…" className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 outline-none" />
        <button onClick={() => { if (!input.trim()) return; ws?.send(input); setInput('') }} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">Yap</button>
      </div>
    </div>
  )
}
