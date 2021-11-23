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
import { Input } from "../../types/mat";
import { useContext, useEffect, useState } from "react";
import { MAT_API } from "../environment";
import { MicContext } from "./../../contexts/MicContext";

function replacer(key: string, value: any) {
  console.log(value);
  if (value === null) {
    return undefined;
  }
  return value;
}

interface Props {
  item: Input;
}

export default function ParameterModal(props: Props) {
  const { component, setComponent } = useContext(MicContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [parameter, setParameter] = useState<Input>(props.item);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setParameter((prevParameter) => ({ ...prevParameter, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      const url = `${MAT_API}/parameters/${parameter?.id}`;
      const temp = JSON.stringify(parameter, replacer);
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: temp,
        });

        if (response.ok) {
          const updatedArr = component?.parameters?.map((item) => {
            if (item.id === parameter?.id) {
              return parameter;
            }
            return item;
          });
          setComponent((prevState) => {
            return {
              ...prevState,
              parameters: updatedArr,
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
      <IconButton onClick={handleOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editing the parameter: {parameter.name}</DialogTitle>
        <form  autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>A Parameter is...</DialogContentText>
            <TextField
              fullWidth
              variant="standard"
              margin="dense"
              value={parameter?.display_name}
              name="display_name"
              id="display_name"
              label="Display name"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              variant="standard"
              margin="dense"
              value={parameter?.description}
              name="description"
              id="description"
              label="description"
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit"> Save changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
