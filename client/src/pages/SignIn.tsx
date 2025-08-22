import React from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useNavigate, useOutletContext } from 'react-router-dom'

export default function SignIn() {
  const nav = useNavigate()
  const { user }: any = useOutletContext()

  const goApp = () => nav('/app')

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10">
        <h1 className="text-2xl font-semibold">Welcome to zkEngagement</h1>
        <p className="mt-2 text-sm text-slate-300">
          Login with Web3: connect your wallet and/or sign in with X. Generate private proofs of social impact.
        </p>
        <div className="mt-4 flex gap-3">
          <ConnectButton />
          <a href="/api/auth/x/login" className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white">Sign in with X</a>
          <button onClick={goApp} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">Enter App</button>
        </div>
      </div>
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="text-sm text-slate-300">Status</div>
        <div className="mt-2 text-slate-100">
          X: {user ? `@${user.handle}` : 'Not connected'}
        </div>
      </div>
    </motion.section>
  )
}
