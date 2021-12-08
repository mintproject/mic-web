import { Grid, Checkbox, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ChangeEvent, useState } from "react";
import { Directive} from "../types/mat";
import ParameterExtractor from "./modals/ParameterExtractor";

interface DirectiveProps {
  directive: Directive;
}

const DirectiveItem = (props: DirectiveProps) => {
  const [active, setActive] = useState<boolean>(false);
  const [hasParameters, setHasParameters] = useState<boolean>(false);

  const activeCheckboxOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActive(event.target.checked);
  }

  return (
    <Grid container spacing={0} sx={{alignItems: "center"}}>
      <Grid item xs={2} md={1}>
        <Checkbox onChange={activeCheckboxOnChange}></Checkbox>
      </Grid>
      <Grid item xs={active ? 8 : 10} md={active ? 9 : 11} style={{color: (active? "inherit" : "rgb(128 128 128)")}}>
        {props.directive.command}
      </Grid>
      {active ? 
        <Grid item xs={2} md={2} style={{textAlign: "right"}}>
          { hasParameters ?
            <span>
              <Tooltip title="Edit parameter">
                <IconButton aria-label="edit parameter" size="small">
                  <EditIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete parameter">
                <IconButton aria-label="delete parameter" size="small">
                  <DeleteIcon color="error"/>
                </IconButton>
              </Tooltip>
            </span>
          :
            <Tooltip title="Add parameter">
              <ParameterExtractor text={props.directive.command as string}></ParameterExtractor>
              {
              //<IconButton aria-label="add parameter" size="small">
              //  <AddIcon color="success"/>
              //</IconButton>
              }
            </Tooltip>
          }
        </Grid>
        : <span/>
      }
    </Grid>
  );
};

export default DirectiveItem;
