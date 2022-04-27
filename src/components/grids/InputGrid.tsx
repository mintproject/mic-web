import Box from "@mui/material/Box";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Grid from "@mui/material/Grid";
import { MicContext } from "../../contexts/MicContext";
import { useEffect, useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import BasicModal from "../modals/BasicModal";

const InputGrid = () => {
  const { component } = useContext(MicContext);
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
      {component?.inputs?.map((input) => (
        <Grid container key={input.id}>
          <Grid item xs={2} md={3}>
            <Box>{input.displayName || input.name}</Box>
          </Grid>
          <Grid item xs={2} md={8}>
            <Box>{input.description} </Box>
          </Grid>
          <Grid item xs={1} md={1}>
            <Box>
                <BasicModal input={input}/>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default InputGrid;
