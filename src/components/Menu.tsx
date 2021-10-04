import { AppBar, Link } from "@mui/material"
import Button from "@mui/material/Button"
import Toolbar from "@mui/material/Toolbar"
import { useKeycloak } from "@react-keycloak/web"
import { Link as RouterLink } from "react-router-dom"

const Menu = () => {
    const {keycloak} = useKeycloak();
    return (
      <AppBar position="relative">
        <Toolbar>
            <Link
              variant='h6'
              color='inherit'
              underline='none'
              component={RouterLink}
              to="/"
            >
              MINT Model Insertion
            </Link>
            {keycloak && !keycloak.authenticated &&
              <Button color="inherit" onClick={() => keycloak.login()}>Login</Button>
            }
            {keycloak && keycloak.authenticated &&
              <Button color="inherit" onClick={() => keycloak.logout()}> Logout </Button>
            }
            
        </Toolbar>
      </AppBar>
    )
}

export default Menu