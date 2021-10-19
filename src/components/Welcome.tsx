import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Welcome() {
  return (
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
            Register my model
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
                  <Button component={Link} to={"/ipython"} variant="contained">
                    Start
                  </Button>
                </Item>
              </Grid>
              <Grid item xs>
                <Item>
                  <p> My model using CLI </p>
                  <Button component={Link} to={'/commandLine'} variant="outlined">
                    Start
                  </Button>
                </Item>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </main>
  );
}

export default Welcome;
