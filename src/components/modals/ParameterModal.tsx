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
import { MAT_API } from "../environment";
import { MicContext } from "./../../contexts/MicContext";
import Box from "@mui/material/Box";
import { Input } from "../../models/Input";
import { Parameter } from "../../models/Parameter";

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
  const [parameter, setParameter] = useState<Parameter>(props.item);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, valueAsNumber, value } = event.target;
    if (name === "min" || name === "max") {
      setParameter((prevParameter) => ({
        ...prevParameter,
        [name]: valueAsNumber,
      }));
    } else {
      setParameter((prevParameter) => ({ ...prevParameter, [name]: value }));
    }
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
        <form autoComplete="off" onSubmit={handleSubmit}>
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
            {/* {parameter?.type === "int" && (
              <Box>
                <TextField
                  fullWidth
                  value={parameter?.min}
                  name="min"
                  id="min"
                  variant="standard"
                  margin="dense"
                  label="Minimum Value"
                  type="number"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  value={parameter?.max}
                  name="max"
                  id="max"
                  type="Number"
                  label="Maximum Value"
                  onChange={handleChange}
                  variant="standard"
                  margin="dense"
                />
              </Box>
            )} */}
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
