import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import io from "socket.io-client";
import "./terminal.css";

const Terminal = () => {
  const xtermRef = useRef<XTerm | null>(null);
  const socket_url: string = "http://localhost:8080";
  const [command, setCommand] = useState("");
  const socket = io(socket_url);

  useEffect(() => {
    xtermRef.current?.terminal.focus();

    //connect with socket server
    socket.on("connect", () => {
      console.log("Established connection with socket server");
      socket.emit("start-session");
    });

    //receive output from the server
    socket.on("output", (data) => {
      xtermRef.current?.terminal.write(data);
    });
  }, []);

  const handleChange = (e: any) => {

    switch (e.domEvent.keyCode) {
      // Enter
      case 13:
        socket.emit("execute");
        setCommand("");
        break;

      // Up arrow
      case 38:
        socket.emit("input", "\u001b[A");
        break;

      // Down arrow
      case 40:
        socket.emit("input", "\u001b[B");
        break;

      // Backspace
      case 8:
        socket.emit("backspace", command);
        break;

      // Ctrl+C
      case 67:
        if (e.domEvent.ctrlKey) {
          socket.emit("sigint");
          setCommand("");
        } else {
          socket.emit("input", e.key);
        }
        break;

      case 127:
        // Backspace
        if (command) {
          socket.emit("input", e.key);
          setCommand((prevState) =>
            prevState.substring(0, prevState.length - 1)
          );
        }
        break;

      default:
        socket.emit("input", e.key);
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <header>
          <div className="button green"></div>
          <div className="button yellow"></div>
          <div className="button red"></div>
        </header>
        <XTerm ref={xtermRef} onKey={handleChange} />
      </div>
    </div>
  );
};

export default Terminal;
