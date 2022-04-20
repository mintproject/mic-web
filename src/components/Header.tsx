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
      <AppBar position="static" style={{backgroundColor: "transparent", borderBottom: "1px solid rgb(230, 230, 230)"}}>
        <Toolbar style={{minHeight: "50px", padding: "0px 10px"}}>
          <Link
            sx={{ flexGrow: 1 }}
            color="inherit"
            underline="none"
            className="breadcrumbs"
            component={RouterLink}
            to="/"
          >
            <Typography component='a' className="active" sx={{ flexGrow: 1, fontWeight: "bold",  }}>
              ▶ MINT
            </Typography>
            <Typography component="a" sx={{ flexGrow: 1 }}>
              Model Insertion
            </Typography>
          </Link>

          {keycloak && !keycloak.authenticated && (
            <Button color="inherit" onClick={() => keycloak.login()} style={{color: "#0f7acf", fontSize: "12px"}}>
              Login
              <AccountCircleIcon fontSize="small" style={{marginLeft: "5px"}}/>
            </Button>
          )}
          {keycloak && keycloak.authenticated && (
            <Button color="inherit" onClick={() => keycloak.logout()} style={{color: "#0f7acf", fontSize: "12px"}}>
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
