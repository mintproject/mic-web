import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MicContext } from "../../contexts/MicContext";
import { useContext } from "react";
import OutputModal from "../modals/OutputModal";

const OutputGrid = () => {
  const { component, setComponent, setId } = useContext(MicContext);
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
      {component?.outputs?.map((output) => (
        <Grid container key={output.id}>
          <Grid item xs={2} md={3}>
            <Box>{output.display_name || output.name}</Box>
          </Grid>
          <Grid item xs={2} md={8}>
            <Box>{output.description} </Box>
          </Grid>
          <Grid item xs={1} md={1}>
            <Box>
                <OutputModal id={output.id as string} output={output}/>
            </Box>
          </Grid>
        </Grid>
      ))}

    </Grid>
  );
};

export default OutputGrid;
