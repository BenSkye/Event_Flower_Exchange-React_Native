import app from './app'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config({ path: '.env' })

let DB = ''
if (process.env.DATABASE && process.env.DATABASE_PASSWORD) {
  DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD)
}
mongoose.connect(DB, {}).then(() => {
  console.log('DB connection successful!')
})
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 5050

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
