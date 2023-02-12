import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
}

const conversationStyle = {
    border: '1px solid black',
    width: '30vw',
    height: '30vw',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
}

function Chat(){
    const location = useLocation();
    const { pseudo } = location.state
    
    const [ conversation, setConversation ] = useState('');

    const getConversation = () => {
        const conv = document.getElementById('conversation');
        fetch(process.env.REACT_APP_PROXY+'/api/getConversation/')
        .then((res) => res.json())  
        .then((res) => {
            if(res.conversation){
                setConversation(res.conversation)
                conv.innerText = conversation
                conv.scrollTop = conv.scrollHeight
            }else{
                conv.innerText = conversation
            }
        })
    }

    const deleteConversation = () => {
        fetch(process.env.REACT_APP_PROXY+'/api/deleteConversation/')
        .then((res) => res.json())
        setConversation('')
        getConversation()
    }

    const sendMessage = () => {
        const textArea = document.querySelector('textarea');
        fetch(process.env.REACT_APP_PROXY+'/api/sendMessage/?' + new URLSearchParams({message: textArea.value, sender: pseudo}))
        .then((res) => res.json())
        textArea.value = ''
        getConversation()
    }
    
    useEffect(() => {
        getConversation()
    }, [conversation]);

    return(
        <>
            <div style={containerStyle}>
                <div>
                    <p>Logged as : {pseudo}</p>
                    <div id='conversation' style={conversationStyle}/>
                    <label>Message</label>
                    <textarea style={{width: '100%', height: '150px', resize: 'none'}}/>
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={deleteConversation}>Delete Discussion</button>
                    </div>
                </div>
        </>
    )
}
export default Chat;