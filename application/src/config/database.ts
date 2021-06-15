import { createConnection } from 'typeorm'

export const connection = async () => {
  try {
    await createConnection()
    console.log('☁ [database]: Database connection established')
  } catch (error) {
    console.error(`⚠ [database]: Couldn't connect to the database: ${error}`)
  }
}
