import express from 'express'
import session from 'express-session'
import crypto from 'crypto'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { registerRoutes } from './routes.js'

const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(16).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

// Static vite dev middleware or built files are handled by vite/hosting during dev.
// API routes:
registerRoutes(app)

const server = createServer(app)

// Attach WebSocket "yapping"
const wss = new WebSocketServer({ server, path: '/yap' })
wss.on('connection', (ws) => {
  ws.on('message', (buf) => {
    const text = buf.toString()
    wss.clients.forEach((c: any) => { if (c.readyState === 1) c.send(text) })
  })
})

const PORT = process.env.PORT || 5173
server.listen(PORT, () => {
  console.log('Server listening on ' + PORT)
})
