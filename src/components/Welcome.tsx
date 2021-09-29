import Terminal from "./Terminal";
import { Link } from "react-router-dom";
import IPython from "./IPython";
import Notebooks from "./Notebooks";
import ModelSummary from "./ModelSummary";
import ModelList from "./ModelList";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';

const theme = createTheme();
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Welcome() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            MINT Model Insertion
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              I would like to encapsulate...
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Grid container spacing={3}>
                <Grid item xs>
                  <Item>     
                    <p> A Python Jupyter Notebook </p>
                   <Button 
                    component={Link} to={'/ipython'}  
                    variant="contained">
                    Start
                   </Button>
                  </Item>
                </Grid>
                <Grid item xs>
                  <Item>     
                    <p> My model using CLI </p>
                   <Button variant="outlined" disabled>Soon</Button>
                  </Item>
                </Grid>
              </Grid>
            </Stack>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default Welcome;
