import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MicContext } from "../contexts/MicContext";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from '@mui/icons-material/ModeEdit';

const ParameterGrid = () => {
  const { model, setModel, setId } = useContext(MicContext);

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
      {model?.parameters?.map((input) => (
        <Grid container>
          <Grid item xs={2} md={3}>
            <Box>{input.display_name || input.name} </Box>
          </Grid>
          <Grid item xs={4} md={6}>
            <Box>{input.description}</Box>
          </Grid>
          <Grid item xs={2} md={2}>
            <Box>{input.type}</Box>
          </Grid>
          <Grid item xs={1} md={1}>
            <Box>
              <IconButton aria-label="delete" disabled color="primary">
                <ModeEditIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default ParameterGrid;
