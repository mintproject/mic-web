import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Parameter } from "../../types/mat";
import { FormEvent, MouseEvent, useState } from "react";

interface Props {
  text: string
}

export default function ParameterExtractor (props: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputText, setInputText] = useState<string>(props.text);
  const [selectedText, setSelectedText] = useState<string>();

  function textSelector (event:MouseEvent<HTMLDivElement>) {
      let selection : string | undefined =  window.getSelection()?.toString();
      if (selection && selection.charAt(0) !== "{" && selection.charAt(selection.length-1) !== "}") {
        console.log(selection);
        setSelectedText(selection);
      } else {
        setSelectedText("");
      }
  }

  function onAddParameter () {
  }

  function handleSubmit(event: FormEvent<EventTarget>) {
  }

  return (
    <div>
      <IconButton aria-label="edit parameter" size="small" onClick={handleOpen}>
        <AddIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Extracting parameters:</DialogTitle>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent onDoubleClick={textSelector} onMouseUp={textSelector} style={{backgroundColor: "antiquewhite", minWidth: "600px"}}>
            <DialogContentText>{inputText}</DialogContentText>
          </DialogContent>
          { selectedText ?
            <DialogContent style={{padding: "20px 36px", display: "flex", justifyContent: "space-between"}}>
              <span>
                {selectedText} = 
                &#123;&#123;
                <input type="text" style={{border: "0px", minWidth: "50px"}} />
                &#125;&#125;
              </span>
              <Button onClick={onAddParameter}>Add parameter</Button>
            {//<TextField name="parameter name" label="Parameter name"/>
            }
            </DialogContent>
            : <span></span>
          }
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
