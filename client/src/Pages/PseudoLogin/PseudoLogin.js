import { Link } from "react-router-dom";
import { useState } from "react";

function PseudoLogin({ socket }){ 
    const [ pseudo, setPseudo ] = useState('');

    const changePseudo = () => {
        const input = document.getElementById('pseudoInput');
        setPseudo(input.value)
    }

    function logUser (){
        if(pseudo === '') return false;         //if the input is empty, avoid socket.emit
        socket.emit('newUser', {pseudo, socketID: socket.id})
    }


    return(
        <div className='uk-flex uk-flex-column uk-flex-center uk-background-secondary uk-height-1-1'>
            <div style={{height: '70%'}}>

                <h1 className='uk-text-center uk-text-muted' >Chat with me !</h1>   
                <div className='uk-flex uk-flex-column uk-flex-middle uk-flex-center' style={{ height: '70%'}}>
                    <label htmlFor='pseudo'>Pseudo</label>
                    <input type='text' id='pseudoInput' className='uk-margin' name='pseudo' placeholder='Enter your pseudo' onChange={changePseudo}/>
                    {
                        pseudo === '' //if pseudo is null, display a dummy disabled button, else display a button linking to the /chat page
                            ?
                                <button className='uk-button uk-button-default' disabled>Enter</button>
                            :
                                <Link id='submitBtn' to='/chat' className='uk-button uk-button-default' onClick={logUser} state={{pseudo: pseudo}} disabled>Enter</Link>
                    }
                </div>
            </div>
        </div>
    )
}
export default PseudoLogin;