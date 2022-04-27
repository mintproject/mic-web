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
import Link from "@mui/material/Link";
import { Output } from "../../models/Output";

function replacer(key: string, value: any) {
  console.log(value);
  if (value === null) {
    return undefined;
  }
  return value;
}

interface Props {
  id: string;
}

export default function OutputModalNew(props: Props) {
  const { setComponent } = useContext(MicContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [output, setInput] = useState<Output>({} as Output);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevParameter) => ({ ...prevParameter, [name]: value }));
  }

  function handleSubmitPost(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      const url = `${MAT_API}/models/${props.id}/outputs`;
      output.name = output.displayName as string;
      let temp = JSON.stringify(output, replacer);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: temp,
        });
        const response_output = await response.json();
        if (response.ok) {
          setComponent((prevState) => {
            return {
              ...prevState,
              outputs: [response_output],
            };
          });
          handleClose();
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
      <Link onClick={handleOpen}> Add new one </Link>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new output</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A output is a File or a collection of Files.
          </DialogContentText>
          <TextField
            fullWidth
            variant="standard"
            margin="dense"
            value={output?.displayName}
            name="displayName"
            id="displayName"
            label="Display name"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="standard"
            margin="dense"
            value={output?.description}
            name="description"
            id="description"
            label="description"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            variant="standard"
            margin="dense"
            value={output?.match}
            name="match"
            id="match"
            label="match"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitPost}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
