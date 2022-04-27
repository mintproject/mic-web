import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { FormComponentNew } from "../components/Component/FormComponentNew";
import { ListComponents } from "../components/Component/ListComponents";

export const ComponentNew = () => {
  return (
    <Container maxWidth="md">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <FormComponentNew />
      </Paper>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <ListComponents/>
      </Paper>
      
    </Container>
  );
};
