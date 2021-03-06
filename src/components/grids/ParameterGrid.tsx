import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MicContext } from "./../../contexts/MicContext";
import { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ParameterModal from "../modals/ParameterModal";

const ParameterGrid = () => {
  const {
    component: model,
    setComponent: setModel,
    setId,
  } = useContext(MicContext);

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
      {model?.parameters?.map((item) => (
        <Grid container key={item.id}>
          <Grid item xs={2} md={3}>
            <Box>{item.display_name || item.name} </Box>
          </Grid>
          <Grid item xs={4} md={6}>
            <Box>{item.description}</Box>
          </Grid>
          <Grid item xs={2} md={2}>
            <Box>{item.type}</Box>
          </Grid>
          <Grid item xs={1} md={1}>
            <Box>
              <ParameterModal item={item} />
            </Box>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default ParameterGrid;
