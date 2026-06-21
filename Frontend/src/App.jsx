import './App.css';
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import {v1 as uuidv1} from 'uuid';

function App() {
  const[prompt , setPrompt] = useState("");
  const[reply , setReply] = useState(null);
  const[currThreadId , setCurrThreadId] = useState(null);
  const[prevChats , setPrevChats] = useState([]); // stores all chats of curr thread
  const[newChat , setNewChat] = useState(true); // to create new chat thread
  const[allThreads , setAllThreads] = useState([]); // to store all chat threads
  
const providerValues = {
prompt, setPrompt,
reply, setReply,
currThreadId, setCurrThreadId,
prevChats, setPrevChats,
newChat, setNewChat,
allThreads, setAllThreads

  
}; //passing values

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
     </MyContext.Provider>
    </div>
  )
}

export default App

