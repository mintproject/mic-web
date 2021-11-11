import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import { Input } from "../types/mat";
import { useContext, useEffect, useState } from "react";
import { MAT_API } from "./environment";
import { MicContext } from "../contexts/MicContext";


function replacer(key: string, value: any) {
  console.log(value);
  if (value === null) {
    return undefined;
  }
  return value;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  input: Input;
}


export default function BasicModal(props: Props) {
  const {model, setModel} = useContext(MicContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [input, setInput] = useState<Input>(props.input)
  
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevParameter) => ({ ...prevParameter, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      const url = `${MAT_API}/inputs/${input?.id}`;
      const temp = JSON.stringify(input, replacer);
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: temp,
        });

        if (response.ok) {
          console.log("ok")
          const updatedArr = model?.inputs?.map(item => {
            if(item.id === item?.id) {
                return input
            }
            return item
          })
          setModel(prevState => {
            return {
              ...prevState, inputs: updatedArr
            }
          })
          handleClose()
        }
        

      } catch (error) {
        //TODO: Show error
        console.log(error);
      }
    };
    submit();
  }
  

  return (
    <div>
      <IconButton>
        <EditIcon onClick={handleOpen} />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A Dataset Specification is the description of an input/output file.
            </DialogContentText>
          <TextField
            fullWidth
            variant="standard"
            margin="dense"
            value={input?.display_name}
            name="display_name"
            id="display_name"
            label="Display name"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="standard"
            margin="dense"
            value={input?.description}
            name="description"
            id="description"
            label="description"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
