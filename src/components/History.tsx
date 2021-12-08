import Grid from "@mui/material/Grid";
import { Directive } from "../types/mat";
import DirectiveItem from "./DirectiveItem";

type Props = {
  directives: Directive[];
  containerId: string;
  modelId: string;
}

const History = (props: Props) => {
  return ( 
    <Grid container spacing={0} style={{paddingRight: "5px"}}>
      {props.directives?.map((directive) => <DirectiveItem key={directive.id} directive={directive} />)}
    </Grid> 
  )
};

export default History;
