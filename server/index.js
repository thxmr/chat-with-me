const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const logFilePath = './conv.txt';

app.use((req, res, next) => { 
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/api/getConversation', function(req, res){
    fs.readFile(logFilePath, 'utf-8', function(err, data){
        res.json({
            conversation: data,
        });
    });
});

app.get('/api/sendMessage', function(req, res){
    fs.appendFile(logFilePath, req.query.sender+':\n'+req.query.message+'\n-----\n', function(err){
        if(err) return err;
        console.log(req.query.sender+' sent a message.')
    })
    res.json({
        sent: true,
    });
});

app.get('/api/getAllUserLogged', function(req, res){
    res.json({
        users: usersConnected
    })
})

let usersConnected = [];
let usersWriting = [];

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        io.emit('messageResponse', data);
    });

    socket.on('newUser', (data) => {
        usersConnected.push(data)
        console.log('A new user just logged in! : ',data)
        io.emit('users', usersConnected);
    });

    socket.on('disconnect', () => {
        usersConnected = usersConnected.filter((user) => user.socketID !== socket.id)
        usersWriting = usersWriting.filter((user) => user.socketID !== socket.id)
        if(usersWriting) socket.broadcast.emit('userWriting', usersWriting)
        io.emit('users', usersConnected);
        socket.disconnect();
    })

    socket.on('isWriting', (data) => {
        let found = false;
        for(let i=0;i<usersWriting.length;i++){
            if(usersWriting[i].socketID == data.socketID){
                found = true;
                break;
            }
        }
        if(!found){
            console.log(`${data.pseudo} is writing`)
            usersWriting.push(data)
            socket.broadcast.emit('userWriting', usersWriting)
        } 
    })

    socket.on('isnotWriting', (data) => {
        console.log(`${data.pseudo} is not writing anymore`)
        usersWriting = usersWriting.filter((user) => user.socketID !== socket.id)
        socket.broadcast.emit('userWriting', usersWriting)
    })
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});