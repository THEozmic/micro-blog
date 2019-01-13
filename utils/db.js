import mongoose from 'mongoose'
const dotenv = require('dotenv')

dotenv.config()

const isProduction = process.env.NODE_ENV !== 'development'

// Initialize connection to database
const dbUrl = isProduction ? process.env.DATABASE_PROD : process.env.DATABASE_DEV

const dbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false
}

let db

mongoose.connect(dbUrl, dbOptions)

db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

export default db
