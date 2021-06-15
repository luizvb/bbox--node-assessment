import express from 'express'
import 'reflect-metadata'
import ProjectsController from './modules/project/controller'
import userController from './modules/user/controller'

import { connection } from './config/database'

import { errorHandler } from './errorHandler'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(errorHandler)

userController.initialize(app)
ProjectsController.initialize(app)

app.use(errorHandler)

app.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://0.0.0.0:${PORT}`)
)

connection()
