import { Parameter as Input } from "../types/mat";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress, Container, Paper, TextField } from "@mui/material";
import { useEffect } from "react";
import { MAT_API } from "./environment";
import React from "react";
interface Props {
  inputId: string;
}

function replacer(key: string, value: any) {
  console.log(value);
  if (value === null) {
    return undefined;
  }
  return value;
}

const InputEditor = (props: Props) => {
  const { inputId } = props;
  const [input, setInput] = useState<Input>();
  const [loading, setLoading] = useState(true);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((prevParameter) => ({ ...prevParameter, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    const submit = async () => {
      const url = `${MAT_API}/inputs/${inputId}`;
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
        }

      } catch (error) {
        //TODO: Show error
        console.log(error);
      }
    };
    submit();
  }

  useEffect(() => {
    const fetchInput = async () => {
      try {
        const response = await fetch(`${MAT_API}/inputs/${inputId}`);
        const data = await response.json();
        setInput(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInput();
  }, [inputId]);

  return loading ? (
    <Box sx={{ display: "flex" }}>
      {" "}
      <CircularProgress />{" "}
    </Box>
  ) : (
    <Container maxWidth="sm">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h6" color="inherit" gutterBottom>
          Tell us about your Input {input?.name}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={input?.display_name}
            name="display_name"
            id="display_name"
            label="Display name"
            variant="outlined"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            value={input?.description}
            name="description"
            id="description"
            label="description"
            variant="outlined"
            onChange={handleChange}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default InputEditor;
