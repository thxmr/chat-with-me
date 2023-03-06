import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const conversationContainerStyle = {
    overflowY: 'scroll',
}

const conversationStyle = {
    border: '1px solid black',
}

function Chat({ socket }){
    const location = useLocation();
    const navigate = useNavigate();

    const [ conversation, setConversation ] = useState('');
    const [ pseudo, setPseudo ] = useState('');
    const [ loaded, setLoaded ] = useState(false);
    const [ isWriting, setIsWriting ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ message, setMessage ] = useState('');

    const getConversation = async () => {
        const conv = document.getElementById('conversationContainer');
        await fetch(process.env.REACT_APP_PROXY+'/api/getConversation/')
        .then((res) => res.json())  
        .then((res) => {
            if(res.conversation){
                setConversation(res.conversation)
                conv.innerHTML = ''                             //reseting the content of the div
                conversation.split('-----\n').forEach((elem) => {       //parsing every message sent with the separator set in sendMessage api
                    let message = elem
                    message = message.split('\n')
                    message.pop()

                    if(message?.length > 0) {           //some message are empty for some reason, so we need to check
                        let msgBubble = document.createElement('div');
                        msgBubble.className = 'uk-flex uk-flex-column uk-position-relative uk-width-1-2 uk-border-rounded uk-padding-small'
                        if(message[0] === pseudo+':') {     //if the bubble is a message the current user sent
                            msgBubble.style.marginLeft = 'auto' 
                            msgBubble.style.backgroundColor = 'green'
                        }else{
                            const msgPseudo = document.createElement('span');
                            msgPseudo.innerText = message[0]
                            conv.appendChild(msgPseudo)
                            msgBubble.style.marginRight = 'auto'
                            msgBubble.style.backgroundColor = 'blue'
                        } 
                        message.shift() //remove the pseudo from message since we aleady treated it
                        let msg = document.createElement('span');
                        const space = document.createElement('br')
                        message.map((msgLine) => {
                            if(msgLine === ""){
                                msg.appendChild(space)
                            }else{
                                msg.innerHTML+=document.createElement('span').innerText = msgLine
                            }
                        })
                        msgBubble.appendChild(msg)              //add the message to the bubble
                        conv.appendChild(msgBubble)             //add the bubble to the conversation
                        conv.appendChild(space)                 //add a white space after the bubble
                    }

                })
                //To set the scrollong position to the bottom by default. Not handled by default because the container is a flex container.
                conv.scrollTop = conv.scrollHeight
            }
        })
    }

    const getUsers = async () => {
        await fetch(process.env.REACT_APP_PROXY+'/api/getAllUserLogged/')
        .then((res) => res.json())
        .then((res) => {
            if(res.users !== users){        //if there is another user logged/disconnected
                setUsers(res.users)
            }
        })
    }

    const sendMessage = async () => {
        const textArea = document.querySelector('textarea');
        await fetch(process.env.REACT_APP_PROXY+'/api/sendMessage/?' + new URLSearchParams({message: textArea.value, sender: pseudo}))
        socket.emit('message', {
            text: message,
            name: pseudo,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
        });
        textArea.value = ''
        setMessage('')
        isTextAreaEmpty()
    }
    
    const isTextAreaEmpty = () => {
        const textArea = document.querySelector('textarea');
        if(textArea.value === '')
        {
            setMessage('')
            socket.emit('isnotWriting', {
                pseudo: pseudo,
                socketID: socket.id,
            })
        }else{
            setMessage(textArea.value)
            socket.emit('isWriting', {
                pseudo: pseudo,
                socketID: socket.id
            })
        }
        return textArea.value === ''
    }

    const generateTypingMessage = () => {
        const usersDisplayable = 3      //limit of writing users displayable at the time
        let typingMessage = ''
        let tempIsWriting = isWriting

        tempIsWriting = tempIsWriting.filter((user) => user.socketID !== socket.id) //remove current user if he is also typing
        if(tempIsWriting.length > 1){
            typingMessage = tempIsWriting[0].pseudo
            tempIsWriting = tempIsWriting.slice(0,usersDisplayable)             //slice the array to keep the exact number of user displayable
            for(let i=1;i<tempIsWriting.length;i++){
                tempIsWriting.length - i === 2                                   // if there is at least 2 others players to display after this one
                    ?
                        typingMessage += ', ' + tempIsWriting[i].pseudo
                    :
                        typingMessage += ' and ' + tempIsWriting[i].pseudo
            }
            typingMessage += ' are writing'
        }else{
            if(tempIsWriting.length > 0)
            {
                typingMessage = tempIsWriting[0].pseudo + ' is writing'
            }
        }
        return typingMessage
    }

    useEffect(() => {
        if(!location.state){        //used to check if the user tried to access /chat without entering his pseudo
            navigate('/')
        }else{
            setPseudo(location.state.pseudo)
        }

        socket.on('messageResponse', (data) => {
            setConversation(data.text)
        })
        
        socket.on('users', (data) => {
            setUsers(data)
        })

        socket.on('userWriting', (data) => {
            setIsWriting(data)
        })

        getUsers()
        getConversation()

        if(users && conversation !== undefined){
            setLoaded(true)
        }

        // eslint-disable-next-line
    }, [conversation, isWriting]);

    return(
        <div className='uk-flex uk-flex-center uk-flex-middle uk-background-secondary uk-height-1-1'>
            <div className="uk-position-center-left uk-margin-left">
                <p>Users connected</p>
                <ul>
                    {
                        loaded 
                            ? 
                                users.map((user, index) => {
                                    return <li key={index}>{user.pseudo}</li>
                                })
                            : 
                                <span uk-spinner="ratio: 2.5"/>                 //display a loading spinner
                    }
                </ul>
            </div>
            <div className='uk-width-1-3' style={{minWidth: '300px'}}>
                <p>Logged as : {pseudo}</p>
                <div id='conversation' style={conversationStyle} className='uk-flex uk-flex-column uk-flex-right uk-width-1-1 uk-height-large'>
                    <div id='conversationContainer' style={conversationContainerStyle}/>
                    {
                        !loaded && <div className='uk-flex uk-flex-center uk-flex-middle uk-height-1-1'><span uk-spinner="ratio: 4.5"/></div>  //display a loading spinner inside a container
                    }    
                </div>
                <span id='isWriting' style={{position: 'absolute'}}>
                    {
                        isWriting.length !== 0 
                            ? 
                                generateTypingMessage()
                            : 
                                ''
                    }
                </span>
                <div className='uk-margin'>
                    <label htmlFor='message'>Message</label>
                    <textarea name='message' onChange={isTextAreaEmpty} className='uk-width-1-1 uk-background-secondary' style={{height: '150px', resize: 'none'}}/>
                </div>
                {
                    message === '' 
                        ?
                            <button className='uk-button uk-button-default' disabled>Send</button>
                        :
                            <button className='uk-button uk-button-default' onClick={sendMessage}>Send</button>
                }   
            </div>
        </div>
    )
}
export default Chat;