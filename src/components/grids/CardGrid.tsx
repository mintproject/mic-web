import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface Props {
  items: any[];
}

const CardGrid = (props: any) => {
  return (
    <Grid container spacing={2}>
      {props.children.map((item: any) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Item>
              {item}
            </Item>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default CardGrid;
