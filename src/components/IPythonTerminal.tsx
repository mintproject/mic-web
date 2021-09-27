import React, { useEffect, useRef, useState } from "react";
import { XTerm } from "xterm-for-react";
import "./terminal.css";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { IPYTHON_API, IPYTHON_WS } from "./environment";

interface IProps {
  taskId: string;
}
const IPythonTerminal = (props: IProps) => {
  const xtermRef = useRef<XTerm | null>(null);
  const ws = new WebSocket(`${IPYTHON_WS}/stream/${props.taskId}`);
  const attachAddon = new AttachAddon(ws);
  const fitAddon = new FitAddon();
  useEffect(() => {
    xtermRef.current?.terminal.focus();
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-window">
        <XTerm ref={xtermRef} addons={[attachAddon, fitAddon]} />
      </div>
    </div>
  );
};

export default IPythonTerminal;
