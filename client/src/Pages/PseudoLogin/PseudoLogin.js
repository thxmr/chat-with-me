import { Link } from "react-router-dom";
import { useState } from "react";

function PseudoLogin(){ 
    const [ pseudo, setPseudo ] = useState('');

    const changePseudo = () => {
        setPseudo(document.getElementById('pseudoInput').value)
    }
    return(
        <>
            <h1 style={{textAlign: 'center'}}>PseudoLogin</h1>
            <div style={{display: 'flex',flexDirection: 'column', alignItems: 'center'}}>
                <label htmlFor='pseudo'>Pseudo</label>
                <input type='text' id='pseudoInput' name='pseudo' onChange={changePseudo}/>
                <Link to='/chat' state={{pseudo: pseudo}}>Enter</Link>
            </div>
        </>
    )
}
export default PseudoLogin;