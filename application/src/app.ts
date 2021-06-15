import express from 'express'
import { connection } from './config/database'
import { errorHandler } from './errors/handler'

import ProjectsController from './modules/project/controller'
import userController from './modules/user/controller'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

userController.initialize(app)
ProjectsController.initialize(app)

app.use(errorHandler)
app.listen(PORT, () => console.log(`⚡️[server] running at: ${PORT}`))

connection()
