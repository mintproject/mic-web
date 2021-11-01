import { Parameter } from "../types/mat";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { CircularProgress, Container, Paper, TextField } from "@mui/material";
import { useEffect } from "react";
import { MAT_API } from "./environment";
import { replacer } from "../utils/utils";
import React from "react"
interface Props {
  parameterId: string;
}

const ParameterEditor = () => {
  const { parameterId } = useParams<Props>();
  const [parameter, setParameter] = useState<Parameter>();
  const [loading, setLoading] = useState(true);
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
    const url = `${MAT_API}/parameters/${parameterId}`;
    const temp = JSON.stringify(parameter, replacer);
    const submit = async () => {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: temp,
      });
      if (response.ok) {
        console.log(response.ok);
      }
    };
    submit();
  }

  useEffect(() => {
    const getParameter = async () => {
      const response = await fetch(`${MAT_API}/parameters/${parameterId}`)
      const data = await response.json();
      setParameter(data);
      setLoading(false);
    };

    getParameter()
  }, [parameterId]);

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
          Describe your parameter: {parameter?.name}
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={parameter?.display_name}
            name="display_name"
            id="display_name"
            label="Display name"
            variant="outlined"
            defaultValue={parameter?.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            value={parameter?.description}
            name="description"
            id="description"
            label="description"
            variant="outlined"
            onChange={handleChange}
          />
          {parameter?.type === "int" && (
            <Box>
              <TextField
                fullWidth
                value={parameter?.min}
                name="min"
                id="min"
                label="Minimum Value"
                type="number"
                variant="outlined"
                onChange={handleChange}
              />
              <TextField
                fullWidth
                value={parameter?.max}
                name="max"
                id="max"
                type="Number"
                label="Maximum Value"
                variant="outlined"
                onChange={handleChange}
              />
            </Box>
          )}

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

export default ParameterEditor;
