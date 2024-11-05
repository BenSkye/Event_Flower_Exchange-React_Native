import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import cron from 'node-cron'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import compression from 'compression'
import AppError from './utils/appError'
import errorController from './controller/errorController'
import authRoute from './routes/authRoute'

import userRoute from './routes/userRoute'
import categoryRoute from '~/routes/categoryRoute'
import flowerRoute from '~/routes/flowerRoute'
import auctionRoute from '~/routes/auctionRoute'
import notificationRoute from '~/routes/notificationRoute'
import AuctionService from '~/services/auctionService'
import orderRoute from '~/routes/orderRoute'
import addressRoute from '~/routes/addressRoute'
import checkoutRoute from '~/routes/checkoutRoute'
import { SocketManager } from '~/socket/SocketManager'
import conversationRoute from '~/routes/conversationRoute'

dotenv.config()

const app = express()
const server = http.createServer(app)

// Initialize socket.io
const socketManager = new SocketManager(server)

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
app.use(morgan('dev'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/flower', flowerRoute)
app.use('/api/v1/auction', auctionRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/address', addressRoute)
app.use('/api/v1/checkout', checkoutRoute)
app.use('/api/v1/notification', notificationRoute)
app.use('/api/v1/conversation', conversationRoute)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

cron.schedule('* * * * *', () => {
  console.log('Running endTimeAuction every minute');
  AuctionService.endTimeStartTimeAuction();
});

app.use(errorController)
export { app, server, socketManager }
