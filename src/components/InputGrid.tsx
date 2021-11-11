import Box from "@mui/material/Box";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Grid from "@mui/material/Grid";
import { MicContext } from "../contexts/MicContext";
import { useEffect, useState, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import BasicModal from "./BasicModal";

const InputGrid = () => {
  const { model, setModel, setId } = useContext(MicContext);
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
      {model?.inputs?.map((input) => (
        <Grid container>
          <Grid item xs={2} md={3}>
            <Box>{input.display_name || input.name}</Box>
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
