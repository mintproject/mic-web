import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import io, { Socket } from "socket.io-client";
import "./terminal.css";
import { useParams } from "react-router-dom";
import {
  getContainer,
  Container,
  createDirective,
  getDirectives,
  Directive,
} from "../types/mat";
import History from "./History";
import Grid from "@mui/material/Grid";

type ContainerParameter = {
  containerId: string;
  modelId: string;
};

// const addCommand = (modelId: string, command: string) => {
//   createDirective(modelId, command);
// };

const Terminal = () => {
  const xtermRef = useRef<XTerm | null>(null);
  const { containerId, modelId } = useParams<ContainerParameter>();
  const [command, setCommand] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const [container, setContainer] = useState<Container>();
  const [directives, setDirectives] = useState<Directive[]>();

  useEffect(() => {
    const get = async () => {
      const response = await getContainer(containerId);
      const data = await response.json();
      setContainer(data);
      const url = `localhost:${data.port}`;
      setSocket(io(url));
    };
    get();
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
    const create = async () => {
      const response = await createDirective(modelId, command);
      const data = await response.json();
      directives
        ? setDirectives((prevState) => [...(prevState ?? []), data])
        : setDirectives((prevState) => [data]);
    };
    switch (e.domEvent.keyCode) {
      // Enter
      case 13:
        socket?.emit("execute");
        create();
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
    const get = async() => {
      const response = await getDirectives(modelId);
      const data = await response.json();
      setDirectives(data)
    }
    get()
  }, [modelId]);

  return (
    <Grid container spacing={0}>
      <Grid item xs={10} md={8}>
        {
        //TODO: onkey avoid copy paste
        }
        <XTerm ref={xtermRef} onKey={handleChange} />
      </Grid>
      <Grid item xs={2} md={4}>
        <History
          directives={directives ?? []}
          containerId={containerId}
          modelId={modelId}
        />
      </Grid>
    </Grid>
  );
};

export default Terminal;
