import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
const socket = io("http://localhost:8080");
const InboxPage = () => {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState<boolean>(false);
  function joinRoom(e: any) {
    e.preventDefault();
    if(userName !== '' && room !== ''){
      socket.emit('join_room', room);
      setShowChat(true);
    }
  }
  return (
    <div className="bg-white text-gray-800 font-sans">
        { !showChat?<div className="flex flex-col items-center">
          <h3 className="text-2xl mb-4">Join a chat</h3>
          <input type="text" placeholder="Enter a name" className="w-52 h-10 border-2 border-green-500 rounded-none px-2 text-ellipses mb-2" 
            onChange={(e) => setUserName(e.target.value)}
          />

          <input type="text" placeholder="Enter a room id" className="w-52 h-10 border-2 border-green-500 rounded-none px-2 text-ellipses mb-2" 
            onChange={(e) => setRoom(e.target.value)}
          />

          <button onClick={joinRoom}
            className="w-52 h-12 border-none bg-green-500 rounder text-white text-base"
          >Join a Room</button>
        </div>:<Chat socket={socket} username={userName} room={room} />}
    </div>
  )
}

export default InboxPage