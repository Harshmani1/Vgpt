    import "./Sidebar.css";
    import { useContext, useEffect } from "react";
    import { MyContext } from "./MyContext.jsx";
    import {v1 as uuidv1} from "uuid";

    function Sidebar() {
        const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

        const getAllThreads = async () => {
            try {
                const response = await fetch("http://localhost:8083/api/thread");
                const res = await response.json();
                const filteredData = res.map(thread => ({threadId: thread._id, title: thread.title}));
               
                setAllThreads(filteredData);
            } catch(err) {
                console.log(err);
            }
        };

  

        useEffect(() => {
            getAllThreads();
        }, [currThreadId])


        const createNewChat = async () => {
          setNewChat(true);
          setPrompt("");
          setReply(null);
          setCurrThreadId(null);
          setPrevChats([]);
          const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "New Chat", messages: [] }), // optional empty message
          };
          try {
            const response = await fetch("http://localhost:8083/api/chat", options);
            const res = await response.json();
            if (res._id) {
              setCurrThreadId(res._id); // <-- real Mongo _id
            }
          } catch (err) {
            console.error("Error creating new chat:", err);
          }
        };

        const changeThread = async (newThreadId) => {
            setCurrThreadId(newThreadId);

            try {
                const response = await fetch(`http://localhost:8083/api/thread/${newThreadId}`);
                const res = await response.json();
                console.log(res);
                setPrevChats(res);
                setNewChat(false);
                setReply(null);
            } catch(err) {
                console.log(err);
            }
        }   

        const deleteThread = async (threadId) => {
            try {
                const response = await fetch(`http://localhost:8083/api/thread/${threadId}`, {method: "DELETE"});
                const res = await response.json();
                console.log(res);

                //updated threads re-render
                setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

                if(threadId === currThreadId) {
                    createNewChat();
                }

            } catch(err) {
                console.log(err);
            }
        }

        return (
            <section className="sidebar">
                <button onClick={createNewChat}>
                    <img src="src/assets/Saarthi_logo22.png" alt="gpt logo" className="logo"></img>
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>


                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx}
                                onClick={(e) => {console.log(thread.id,"###",idx,",Thread clicked:", thread.threadId); changeThread(thread.threadId)}}
                                className={thread.threadId === currThreadId ? "highlighted": " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation(); //stop event bubbling
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    }
                </ul>
    
                <div className="sign">
                    <p>By Harshmani Khare &hearts;</p>
                </div>
            </section>
        )
    }

    export default Sidebar;