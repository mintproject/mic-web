import * as React from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import { useContext, useEffect, useState } from "react";
import { MAT_API } from "../../constants/environment";
import { MicContext } from "./../../contexts/MicContext";
import { Input } from "../../models/Input";
import { replacer } from "../../utils/utils";


interface Props {
  input: Input;
}


export default function BasicModal(props: Props) {
  const {component, setComponent} = useContext(MicContext);
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
          const updatedArr = component?.inputs?.map(item => {
            if(item.id === input?.id) {
                return input
            }
            return item
          })
          setComponent(prevState => {
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
      <IconButton onClick={handleOpen}>
        <EditIcon  />
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
            value={input?.displayName}
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
