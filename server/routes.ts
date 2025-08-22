import type { Express } from 'express'

// super-light in-memory store (swap for DB/Drizzle later)
const store = {
  users: new Map<number, any>() // id -> { id, handle, displayName, pfpUrl }
}

export function registerRoutes(app: Express) {
  // ---- Health
  app.get('/api/health', (_, res) => res.json({ ok: true }))

  // ---- X OAuth (placeholder)
  app.get('/api/auth/x/login', (req, res) => {
    // TODO: Implement OAuth2 Authorization Code (PKCE) with your X client.
    // For demo we “log in” a user into the session:
    ;(req.session as any).user = {
      id: 1,
      handle: 'zkengager',
      displayName: 'ZK Engager',
      pfpUrl: 'https://unavatar.io/twitter/zk'
    }
    store.users.set(1, (req.session as any).user)
    res.redirect('/')
  })

  app.get('/api/auth/x/me', (req, res) => {
    res.json((req.session as any).user || null)
  })

  app.get('/api/auth/x/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }))
  })

  // ---- zkVerify (stub)
  app.post('/api/zk/engagement/prove', async (_req, res) => {
    // Replace this with your proving system (Noir/Circom/PolygonID/etc)
    const proofId = 'proof_' + Date.now()
    res.json({ proofId })
  })

  // ---- Relayer (stub)
  app.post('/api/relay/tx', async (req, res) => {
    if (!process.env.RELAYER_API_KEY) return res.status(400).json({ message: 'Missing RELAYER_API_KEY' })
    // TODO: Relay the meta-tx with your provider (Biconomy/Defender/custom)
    res.json({ relayed: true })
  })

  // ---- Example: achievements/proofs fetch (ready to back by DB later)
  app.get('/api/user/:id', (req, res) => {
    const id = Number(req.params.id)
    const u = store.users.get(id)
    if (!u) return res.status(404).json({ message: 'User not found' })
    res.json(u)
  })
}
