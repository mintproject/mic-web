import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { Directive, getDirectives } from "../types/mat";
import Command from "./Command";

type Props = {
  directives: Directive[];
  containerId: string;
  modelId: string;
}

const History = (props: Props) => {
  return ( 
    <Grid container spacing={0}>
      {props.directives?.map((directive) => <Command  command={directive.command} />)}
    </Grid> 
  )
};

export default History;
