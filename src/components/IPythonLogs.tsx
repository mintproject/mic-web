import React, { useEffect, useState, useRef } from "react";
import { MAT_API } from "./environment";
interface Message {
  id: string;
  message: string;
}


interface IProps {
    taskId: string
}
const IPythonLogs = (props: IProps) => {
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const ws: any = useRef();

  const scrollTarget = useRef<any>(null);
  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  
  useEffect(() => {

    ws.current = new WebSocket(`ws://${MAT_API}/stream/${props.taskId}`);
    ws.current.onopen = () => {
      console.log("Connection opened!");
      setConnectionOpen(true);
    };
    ws.current.onmessage = (ev: any) => {
        console.log(ev.data)
      const message: Message = JSON.parse(ev.data);
      console.log(message);
      setMessages((_messages) => [..._messages, message]);
    };
    ws.current.onclose = (ev: any) => {
      if (ev.code === 4000) {
        console.log("kicked");
      }
    };

    return () => {
      console.log("Cleaning up! 🧼");
      ws.current.close();
    };
  }, []);

  return (
    <div className='chat-view-container'>
        <p> logs: </p>
    {messages.map((message) => (
        <p key={message.id}>{message.message}</p>
      ))}
    <div ref={scrollTarget} />
    </div>
  );
};

export default IPythonLogs;
