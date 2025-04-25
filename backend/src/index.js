import {app} from './app.js'
import dotenv from 'dotenv'
import {createServer} from 'http'
import connectDB from './db/db.js'


dotenv.config({
    path: './.env',
})

const PORT = process.env.PORT || 3001
const server = createServer(app)


connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(`MONGODB connection error at index.js :: Error ::  `, err)
    })

