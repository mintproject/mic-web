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
  output: Output;
  id: string;
}

export default function OutputModal(props: Props) {
  const { setComponent, component} = useContext(MicContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [output, setOutput] = useState<Output>({} as Output);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setOutput((prevParameter) => ({ ...prevParameter, [name]: value }));
  }

  useEffect(() => {
    setOutput(props.output);
  }, []);

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      const url = `${MAT_API}/outputs/${props.id}`;
      output.name = output.displayName as string;
      let temp = JSON.stringify(output, replacer);
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: temp,
        });
        await response;
        if (response.ok) {
          const updatedArr = component?.outputs?.map(item => {
            if(item.id === output?.id) {
                return output
            }
            return item
          })
          setComponent(prevState => {
            return {
              ...prevState, outputs: updatedArr
            }
          })
          
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
      <IconButton onClick={handleOpen}>
        <EditIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit new output</DialogTitle>
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
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
