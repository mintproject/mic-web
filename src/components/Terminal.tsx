import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import io, { Socket } from "socket.io-client";
import "./terminal.css";
import { MAT_API } from "./environment";
import { useParams } from "react-router-dom";
import {
  getContainer,
  Container,
  createDirective,
  getDirectives,
  Directive,
} from "../types/mat";
import Command from "./Command";
import History from "./History";

type ContainerParameter = {
  containerId: string;
  modelId: string;
};

const addCommand = (modelId: string, command: string) => {
  console.log(`submit ${command}`);
  createDirective(modelId, command);
};

const Terminal = () => {
  const xtermRef = useRef<XTerm | null>(null);
  const { containerId: containerId, modelId: modelId } =
    useParams<ContainerParameter>();
  const [command, setCommand] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [container, setContainer] = useState<Container>();
  const [loading, setLoading] = useState(true);
  const [directives, setDirectives] = useState<Directive[]>();

  useEffect(() => {
    getContainer(containerId)
      .then((response) => response.json())
      .then((data) => {
        setContainer(data);
        setSocket(io(`localhost:${data?.port}`));
        setLoading(false);
      });
  }, [containerId]);

  useEffect(() => {
    xtermRef.current?.terminal.focus();

    //connect with socket server
    socket?.on("connect", () => {
      console.log("Established connection with socket server");
      socket.emit("start-session");
    });

    //receive output from the server
    socket?.on("output", (data) => {
      xtermRef.current?.terminal.write(data);
    });
  }, [socket]);

  const handleChange = (e: any) => {
    switch (e.domEvent.keyCode) {
      // Enter
      case 13:
        socket?.emit("execute");
        if (directives){
          
        }
        //setDirectives((prev) => [...prev ?? [], command]);
        createDirective(modelId, command)
        .then(response => response.json())
        .then(data => {
          if (directives){
            setDirectives(prevState => [...prevState ?? [], data]);
          } else {
            setDirectives(prevState => [data])
          }
        })
        setCommand("");
        break;

      // Up arrow
      case 38:
        socket?.emit("input", "\u001b[A");
        break;

      // Down arrow
      case 40:
        socket?.emit("input", "\u001b[B");
        break;

      // Backspace
      case 8:
        if (command) {
          socket?.emit("input", e.key);
          setCommand((prevState) =>
            prevState.substring(0, prevState.length - 1)
          );
        }
        break;

      // Ctrl+C
      case 67:
        if (e.domEvent.ctrlKey) {
          socket?.emit("sigint");
          setCommand("");
        } else {
          socket?.emit("input", e.key);
        }
        break;

      case 127:
        // Backspace
        console.log("delete");
        if (command) {
          socket?.emit("input", e.key);
          setCommand((prevState) =>
            prevState.substring(0, prevState.length - 1)
          );
        }
        break;

      default:
        setCommand((prevState) => prevState + e.key);
        socket?.emit("input", e.key);
    }
  };

  useEffect(() => {
    getDirectives(modelId)
      .then((directives) => directives.json())
      .then((data) => {
        console.log(data);
        setDirectives(data);
      });
  }, [modelId]);

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <XTerm ref={xtermRef} onKey={handleChange} />
      </div>
      <History directives={directives ?? []} containerId={containerId} modelId={modelId} />
    </div>
  );
};

export default Terminal;
