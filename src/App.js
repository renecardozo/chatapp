import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatGroup from './components/ChatGroup';
import chat from './lib/chat';
import {useEffect} from 'react';


function App() {

  useEffect(() => {
    chat.init();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Navigate to='/login'/>}/>
        <Route exact path='/login' element={<Login />} />
        <Route path='/chat' element={<ChatGroup />}/>
      </Routes>
    </div>
  );
}

export default App;
