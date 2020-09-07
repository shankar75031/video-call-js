import express from 'express'
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'
import socketio from 'socket.io'
import http from 'http'
import peer from 'peer'

const {ExpressPeerServer} = peer
const app = express();
const server =http.Server(app)
const port = process.env.PORT || 3030
const io = socketio(server)
const peerServer = ExpressPeerServer(server, {
    debug: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.json())
app.use(cors())

app.use('/peerjs', peerServer)

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    })
})

server.listen(port, () => console.log(`Listening on localhost:${port}`))