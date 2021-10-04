import { useEffect, useRef } from "react";
import { XTerm } from "xterm-for-react";
import "./terminal.css";
import { AttachAddon } from "xterm-addon-attach";
//import { FitAddon } from "xterm-addon-fit";
import { IPYTHON_WS } from "./environment";

interface IProps {
  taskId: string;
}
const IPythonTerminal = (props: IProps) => {
  const xtermRef = useRef<XTerm | null>(null);
  const ws = new WebSocket(`${IPYTHON_WS}/stream/${props.taskId}`);
  const attachAddon = new AttachAddon(ws);
  //const fitAddon = new FitAddon();
  useEffect(() => {
    xtermRef.current?.terminal.focus();
  }, []);

  return (
        <XTerm ref={xtermRef} addons={[attachAddon]} />
  );
};

export default IPythonTerminal;
