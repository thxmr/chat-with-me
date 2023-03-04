# Chat with me

This project was meant to be a school project, developped in React and Node.JS, with which you can simulate a chat application on your machine.<br/>
In this project, they are no databases, but a .txt file is created and modified, in order to store the conversation.

---
## Configuration needed 
The only thing that you need is a .env file inside client folder.
Paste the following inside : 
<pre>
// Change {PORT} with the port where your server will be running

REACT_APP_PROXY=http://localhost:{PORT}
</pre>

---
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.

in client/:<br/>
Open [http://localhost:3000](http://localhost:3000) to view the client side in your browser.

in server/:<br/>
Open [http://localhost:{PORT}](http://localhost:{PORT}) to launch the server side in your console.

---
## Dependencies
### npm
#### server/
- socket.io for managing realtime update server-side
- socket.io-client for managing realtime update client-side in a React file
- express for creating api routes 
- fs for managing local file (not usefull if the messages are delocated (DB, localStorage in navigator, etc..) )
- cors for enabling CORS with various options
#### client/
- react-router-dom for managing client-side routes

### cdn
- UIkit for styling components 
---
## API Routes
### GET
`/api/getConversation` <br/>
<pre>
Response : {
    conversation: String,
}
</pre>
`/api/sendMessage` <br/>
<pre>
Params (passed as instance of URLSearchParams): 
-   sender : String
-   message : String
</pre>
<pre>
Response : {
    sent: Boolean,
}
</pre>
`/api/getAllUserLogged` <br/>
<pre>
Response : {
    users: [
        {
            pseudo: String,
            socketID: String,
        },
    ]
}
</pre>
---
## Socket Events (Listener, Utility, Emission)

`newUser, (data = {user.pseudo, user.socketID})`<br/>
Add the new user to an array of users logged <br/>
`emit('users', usersConnected)`
<br/><br/>

`isWriting, (data = {user.pseudo, user.socketID})`<br/>
Append the user data to an array of users that are currently writing, only if the user is not already in the array.<br/>
`broadcast.emit('userWriting',usersWriting)`
<br/><br/>

`isNotWriting, (data = {user.pseudo, user.socketID})`<br/>
Remove the user from the usersWriting array.<br/>
`broadcast.emit('userWriting',usersWriting)`
<br/><br/>

`message, (data = {user.pseudo, user.socketID}) `<br/>
Send the information to all client that a new message has been sent.<br/>
`emit('messageResponse',data)`
<br/><br/>

`disconnnect, ()` <br/>
Remove the user from the usersConnected and usersWriting arrays. Then, disconnect the client from the socket.<br/>
`emit('users', usersConnected)`

