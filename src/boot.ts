import express from 'express'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { initializeProjects } from './entity/Project'
import { initializeUsers } from './entity/User'
import { errorHandler } from './errorHandler'
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(errorHandler)
initializeUsers(app)
initializeProjects(app)

app.listen(PORT, () => console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`))

createConnection()
  .then((_) => console.log('☁ [database]: Database connection established'))
  .catch((error) =>
    console.error(`⚠ [database]: Couldn't connect to the database: ${error}`)
  )
