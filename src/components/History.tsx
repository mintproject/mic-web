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
    <Grid container spacing={0}>
      {props.directives?.map((directive) => <DirectiveItem directive={directive} />)}
    </Grid> 
  )
};

export default History;
