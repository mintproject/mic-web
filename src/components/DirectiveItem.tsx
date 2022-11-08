import { Button} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Directive } from "../models/Directive";

interface Props {
  directive: Directive;
}

const DirectiveItem = (props: Props) => {

  const toogle = (directiveId: string | undefined) => {
    
    directiveId && console.log(directiveId)
  }
  return (
    <Grid container spacing={0}>
      <Grid item xs={2} md={8}>
        <Box key={props.directive.id}>{props.directive.command}</Box>
      </Grid>
      <Grid item xs={2} md={4}>
        <Button onClick={() => toogle(props.directive.id)}>Add directive</Button>
      </Grid>
    </Grid>
  );
};

export default DirectiveItem;
