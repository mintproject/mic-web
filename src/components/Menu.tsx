import { AppBar, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useKeycloak } from "@react-keycloak/web";
import { Link as RouterLink } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Menu = () => {
  const { keycloak } = useKeycloak();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Link
            sx={{ flexGrow: 1 }}
            variant="h6"
            color="inherit"
            underline="none"
            component={RouterLink}
            to="/"
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MINT Insertion
            </Typography>
          </Link>

          {keycloak && !keycloak.authenticated && (
            <Button color="inherit" onClick={() => keycloak.login()}>
              Login
              <AccountCircleIcon style={{marginLeft: "5px"}}/>
            </Button>
          )}
          {keycloak && keycloak.authenticated && (
            <Button color="inherit" onClick={() => keycloak.logout()}>
              {" "}
              Logout{" "}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Menu;
