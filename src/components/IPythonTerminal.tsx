import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import "./terminal.css";
import { AttachAddon } from 'xterm-addon-attach';

interface IProps {
    taskId: string
}
const IPythonTerminal = (props: IProps) => {
  const xtermRef = useRef<XTerm | null>(null);
  const socket_url: string = `http://localhost:8080/stream/${props.taskId}`;

    const ws = new WebSocket(`ws://localhost:8004/stream/${props.taskId}`);
    const attachAddon = new AttachAddon(ws);
  useEffect(() => {
    xtermRef.current?.terminal.focus();

  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <header>
          <div className="button green"></div>
          <div className="button yellow"></div>
          <div className="button red"></div>
        </header>
        <XTerm ref={xtermRef} addons={[attachAddon]} />
      </div>
    </div>
  );
};

export default IPythonTerminal;
