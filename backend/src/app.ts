import express from 'express'
import cors from 'cors'
import { partnerRouter } from './routes/partnerRoutes.js'
import { roundRouter } from './routes/roundRoutes.js'
import { advanceRouter } from './routes/advanceRoutes.js'
import { liquidationRouter } from './routes/liquidationRoutes.js'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'accounting-backend', timestamp: new Date().toISOString() })
})

app.use('/api/partners', partnerRouter)
app.use('/api/rounds', roundRouter)
app.use('/api/advances', advanceRouter)
app.use('/api/liquidations', liquidationRouter)
