import { Routes, Route } from 'react-router-dom';
import PseudoLogin from './Pages/PseudoLogin/PseudoLogin';
import Chat from './Pages/Chat/Chat';
import socketIO from 'socket.io-client';

const socket = socketIO.connect(process.env.REACT_APP_PROXY); //Create a socket connection on the server located in REACT_APP_PROXY address

function App() {
	return (
		<Routes>
			<Route path='/login' element={<PseudoLogin socket={socket}/>}/>
			<Route path='/chat' element={<Chat socket={socket}/>}/>
			<Route path='*' element={<PseudoLogin socket={socket}/>}/>
		</Routes>
	);
}

export default App;
