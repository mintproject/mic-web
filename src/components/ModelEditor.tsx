import { Paper, Box, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Model, Parameter, Input } from "../types/mat";
import { MAT_API } from "./environment";
import Grid from "@mui/material/Grid";
import React from "react"
interface InputItemGridProps {
  input: Input;
}

interface ParameterItemGridProps {
  input: Parameter;
}

interface ParameterGridProps {
  model: Model;
}

const InputGrid = (props: ParameterGridProps) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={2} md={3}>
        <Box>Name</Box>
      </Grid>
      <Grid item xs={2} md={8}>
        <Box>Description</Box>
      </Grid>
      <Grid item xs={4} md={1}>
        <Box></Box>
      </Grid>
      {props.model?.inputs?.map((input) => (
        <InputGridItem key={input.id} input={input} />
      ))}
    </Grid>
  );
};

const ParameterGrid = (props: ParameterGridProps) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={4} md={3}>
        <Box>Name</Box>
      </Grid>
      <Grid item xs={4} md={6}>
        <Box>Description</Box>
      </Grid>
      <Grid item xs={4} md={2}>
        <Box>Type</Box>
      </Grid>
      <Grid item xs={4} md={1}>
        <Box></Box>
      </Grid>
      {props.model?.parameters?.map((input) => (
        <ParameterGridItem key={input.id} input={input} />
      ))}
    </Grid>
  );
};

const InputGridItem = (props: InputItemGridProps) => {
  return (
    <Grid container>
      <Grid item xs={2} md={3}>
        <Box>{props.input.display_name || props.input.name}</Box>
      </Grid>
      <Grid item xs={2} md={8}>
        <Box>{props.input.description} </Box>
      </Grid>
      <Grid item xs={1} md={1}>
        <Box>
          <Link to={`/inputs/${props.input.id}`}> Edit </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

const ParameterGridItem = (props: ParameterItemGridProps) => {
  return (
    <Grid container>
      <Grid item xs={2} md={3}>
        <Box>{props.input.display_name || props.input.name } </Box>
      </Grid>
      <Grid item xs={4} md={6}>
        <Box>{props.input.description}</Box>
      </Grid>
      <Grid item xs={2} md={2}>
        <Box>{props.input.type}</Box>
      </Grid>
      <Grid item xs={1} md={1}>
        <Box>
          <Link to={`/parameters/${props.input.id}`}> Edit </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

interface Props {
  model: Model;
}

function replacer(key: string, value: any) {
  console.log(value);
  if (key === "inputs" || key === "parameters" || value === null) {
    return undefined;
  }
  return value;
}

const micModelPut = (model: Model) => {
  const url = `${MAT_API}/models/${model.id}`;
  //todo: hack
  const temp = JSON.stringify(model, replacer);
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: temp,
  });
};


const ModelEditor = (props: Props) => {
  const [model, setModel] = useState<Model>();
  const [saving, setSaving] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    setSaving(true);
    const response = await micModelPut(model as Model)
    response.ok && setSaving(false);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  }

  useEffect(() => {
    setModel(props.model);
  }, [props]);

  return (
    <Paper
      variant="outlined"
      sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
    >
      <Typography variant="h6" color="inherit" gutterBottom>
        Tell us about your Model
      </Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="display"
          placeholder="Display Name"
          name="name"
          value={model?.name}
          variant="outlined"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          id="description"
          placeholder="Description"
          name="description"
          value={model?.description}
          variant="outlined"
          onChange={handleChange}
        />
        <h3> Inputs </h3>
        {model?.inputs ? (
        <InputGrid model={model as Model} />
        ): (
          "None"
        )
        }
        <h3> Parameters </h3>
        {model?.parameters ? (
          <ParameterGrid model={model as Model} />
        ) : (
            "None"
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button type="submit" variant="contained">
            {saving ? "Saving" : "Save"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ModelEditor;
