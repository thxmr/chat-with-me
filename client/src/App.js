import { Routes, Route } from 'react-router-dom';
import PseudoLogin from './Pages/PseudoLogin/PseudoLogin';
import Chat from './Pages/Chat/Chat';

function App() {
	return (
		<Routes>
			<Route path='/login' element={<PseudoLogin/>}/>
			<Route path='/chat' element={<Chat/>}/>
			<Route path='*' element={<PseudoLogin/>}/>
		</Routes>
	);
}

export default App;
