const express = require('express');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

const logFilePath = './conv.txt';

app.use((req, res, next) => { 
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/api/getConversation', function(req, res){
    fs.readFile(logFilePath, 'utf-8', function(err, data){
        res.json({
            conversation: data ? data : null,
        });
    });
});

app.get('/api/sendMessage', function(req, res){
    fs.appendFile(logFilePath, req.query.sender+':\n'+req.query.message+'\n-----\n', function(err){
        if(err) return err;
        console.log(req.query.sender+' sent a message.')
    })
});

app.get('/api/deleteConversation', function(req, res){
    fs.unlink(logFilePath, function(err){
        if(err) return err;
        console.log('Conversation deleted !');
    })
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});