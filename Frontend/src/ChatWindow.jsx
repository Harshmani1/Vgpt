import "./ChatWindow.css";
import Chat from './Chat.jsx'
import { MyContext } from "./MyContext.jsx";
import { useContext , useState , useEffect } from "react";
import{PacmanLoader} from 'react-spinners';


function ChatWindow() {

const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setCurrThreadId, setAllThreads} = useContext(MyContext);

const [loading, setLoading] = useState(false);
const[isOpen,setIsOpen] = useState(false);  // set default false value

const getReply = async () => {
  setLoading(true);
  console.log("message", prompt, "threadId", currThreadId);

  try {
    const response = await fetch("http://localhost:8083/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId, // can be null initially
      }),
    });

    const res = await response.json();

    setReply(res.reply);

    // Save the new threadId if backend returned one
    if (res.threadId) {
      setAllThreads(prev => [...prev, { threadId: res.threadId, title: prompt }]);
      setCurrThreadId(res.threadId);
    }

  } catch (err) {
    console.log(err);
  }

  setLoading(false);
};

//Append new chat to prev chats
useEffect(() => {
  if (prompt && reply) {
    setPrevChats(prevChats =>(

      [...prevChats,{
        role: "user",
        content: prompt
      },{
        role: "assistant",
        content: reply
      }

    ]
    ))
  }
  setPrompt("");
  

}, [reply]);

const handleProfileClick = () => {
  setIsOpen(!isOpen); // Toggle the dropdown visibility
}


  
  return (
    


    <div className="ChatWindow">
       <div className="navbar">
        <span>Saarthi <i className="fa-solid fa-chevron-down"></i>  </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
        <span className="userIcon">  <i className="fa-solid fa-user"></i></span>
          </div>

       </div>
       {
        isOpen && 
        <div className="dropDown">

           <div className="dropDownItems"> <i class="fa-solid fa-gear"></i>Setting</div>
                     <div className="dropDownItems"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
          <div className="dropDownItems"> <i class="fa-solid fa-right-from-bracket"></i>Log out</div>
             
        </div>







       }

       <Chat></Chat>
       <PacmanLoader color="#fff" loading ={loading} size={20} className="loader">

        </PacmanLoader>

       <div className="chatInput">
        <div className="inputBox">
         <input placeholder="Ask anything"
          
         value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) =>  e.key === "Enter"? getReply() : ''}
             
         >

         </input>
         <div id="submit"onClick = {getReply}>
          <i className="fa-solid fa-paper-plane"></i>
         </div>
        </div>
        <p className="info">
          Saarthi can make mistakes, Check important info, See  Cookie Preferences.

        </p>
       </div>
    </div>
  )
  
}
export default ChatWindow;


// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect } from "react";
// import { PacmanLoader } from "react-spinners";

// function ChatWindow() {
//   const {
//     prompt,
//     setPrompt,
//     reply,
//     setReply,
//     currThreadId,
//     prevChats,
//     setPrevChats,
//     setCurrThreadId,
//     setAllThreads,
//   } = useContext(MyContext);

//   const [loading, setLoading] = useState(false);

//   const getReply = async () => {
//     setLoading(true);
//     console.log("message", prompt, "threadId", currThreadId);

//     try {
//       const response = await fetch("http://localhost:8083/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: prompt,
//           threadId: currThreadId, // can be null initially
//         }),
//       });

//       const res = await response.json();

//       // ✅ Update reply from backend
//       setReply(res.reply);

//       // ✅ Handle threads correctly
//       if (res.threadId) {
//         setAllThreads((prev) => {
//           // 1. Check if this thread already exists
//           const exists = prev.some((t) => t.threadId === res.threadId);

//           // 2. If not exists, add as new
//           if (!exists) {
//             return [...prev, { threadId: res.threadId, title: prompt }];
//           }

//           // 3. If exists, return old list (no duplicates)
//           return prev;
//         });

//         // ✅ Always set the current thread so conversation continues
//         setCurrThreadId(res.threadId);
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     setLoading(false);
//   };

//   // ✅ Append messages into prevChats when reply updates
//   useEffect(() => {
//     if (prompt && reply) {
//       setPrevChats((prevChats) => [
//         ...prevChats,
//         { role: "user", content: prompt },
//         { role: "assistant", content: reply },
//       ]);
//     }

//     // Clear the input box after sending
//     setPrompt("");
//   }, [reply]);

//   return (
//     <div className="ChatWindow">
//       {/* Top Navbar */}
//       <div className="navbar">
//         <span>
//           Saarthi <i className="fa-solid fa-chevron-down"></i>
//         </span>
//         <div className="userIconDiv">
//           <span className="userIcon">
//             <i className="fa-solid fa-user"></i>
//           </span>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <Chat />

//       {/* Loading Animation */}
//       <PacmanLoader color="#fff" loading={loading} size={20} className="loader" />

//       {/* Input Box */}
//       <div className="chatInput">
//         <div className="inputBox">
//           <input
//             placeholder="Ask anything"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
//           />
//           <div id="submit" onClick={getReply}>
//             <i className="fa-solid fa-paper-plane"></i>
//           </div>
//         </div>
//         <p className="info">
//           Saarthi can make mistakes, Check important info, See Cookie Preferences.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;
