import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const ChatPage = ({socket, username, room}: any) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState<any>([{
        room: 123,
        author:'peter',
        message: 'tested',
        time: "21:51"
    },
    {
        room: 123,
        author:'peter',
        message: 'sadfasd',
        time: "21:52"
    }
]);
    useEffect(() => {
        socket.on('receive_message', (data: any) => {
            setMessageList((prev: any) =>  [...prev, data]);
        });
  }, [socket]);
  const sendMessage = async() => {
    if(currentMessage !== ''){
        const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time: new Date(Date.now()).getHours() + ":"+ new Date(Date.now()).getMinutes(),
        };
        await socket.emit('send_message', messageData);
        setMessageList((prev:any) => [...prev, messageData]);
        setCurrentMessage("");

    }
  }
  /* {
    room:room
    author: username,
    message: messageList,
    time: 
  } */
    return (
    <div className="chat-windwo">
        <div className="bg-gray-800 rounded-t-lg cursor-pointer">
            <p className="text-white font-bold py2 px-4">Live Chat</p>
        </div>
        <div className="chat-body border border-gray-800 rounded-b-lg bg-white relative">
            <ScrollToBottom className="h-full overflow-y-scroll overflow-x-hidden">
                {
                    messageList.map((messageContent:any) => {
                        return (
                            <div key={messageContent.time} id={username === messageContent.author?"you":"other"} className={`message flex ${username === messageContent.author?"justify-start":"justify-end"}`}>
                                <div>
                                    <div className={`message-content min-h-40 max-2-120 flex items-center 
                                    ${username === messageContent.author?"bg-green-500": "bg-blue-500"}`}>
                                        <p className="text-white px-2 break-words">
                                            {messageContent.message}
                                        </p>
                                    </div>
                                    <div className={`message-meta flex font-xs ${username === messageContent.author?"justify-start":"justify-end"}`}>
                                        <p id="time">{messageContent.time}</p>
                                        <p className="font-bold ml-2" id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </ScrollToBottom>
        </div>
        <div className="chat-footer border border-t-0">
            <input type="text" onChange={(e) => e.target.value} defaultValue={currentMessage} placeholder="Enter message here"
            className="w-full h-full border-0 text-sm outline-none cursor-pointer"
            onKeyUp={(e:any) => e.key === 'Enter' && sendMessage() } />
            <button onClick={sendMessage} 
            className="w-15 h-full bg-transparent text-gray-400 text-2xl outline-none cursor-pointer">
                &#9698;
            </button>

        </div>
    </div>
  )
}

export default ChatPage