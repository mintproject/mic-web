import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import CardGrid from "../components/grids/CardGrid";
import { Component } from "../models/Component";
import { getComponent, updateComponent } from "../services/api/Component";
import SendIcon from "@mui/icons-material/Send";
import { getSpec } from "../services/api/Spec";
import { getFilesCwl, getParametersCwl } from "../adapters/cwl2modelCatalog";
import { createParameters, deleteParameters } from "../services/api/Parameter";
import { createInputs, deleteInputs } from "../services/api/Input";
import { COMPONENTS_URL, EXECUTION_SAMPLE } from "../constants/routes";
interface Params {
  id: string;
}

export const Notebooks = (props: any) => {
  const { id } = useParams<Params>();
  console.log(id);
  const [error, setError] = useState("");
  const [component, setComponent] = useState<Component>();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    getComponent(id)
      .then((component) => {
        setComponent(component);
        console.log(component);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
    <Container maxWidth="md">
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h4">Notebooks</Typography>
        <Typography variant="body1" sx={{ my: { xs: 2, md: 3 } }}> 
          Select the notebook to use
        </Typography>
        {component && component.gitRepo && component.gitRepo.notebooks && (
          <CardGrid>
            {component.gitRepo.notebooks.map((notebook) => {
              return (
                <Box p={2}>
                  <Typography variant="h6">{notebook.name}</Typography>
                  <Button
                    onClick={async () => {
                      const spec = await getSpec(notebook);
                      updateComponent({
                        ...component,
                        hasComponentLocation: notebook.spec,
                        type: notebook.inferredBy,
                        dockerImage: component.gitRepo?.dockerImage,
                      });
                      deleteParameters(component.id!);
                      deleteInputs(component.id!);
                      const inputs = getFilesCwl(spec);
                      const parameters = getParametersCwl(spec);
                      createParameters(component.id!, parameters);
                      createInputs(component.id!, inputs);
                      console.log(spec);
                      history.push(`${COMPONENTS_URL}/${component.id}/${EXECUTION_SAMPLE}`);
                    }}
                    variant="outlined"
                  >
                    Mark as your component
                  </Button>
                </Box>
              );
            })}
          </CardGrid>
        )}
      </Paper>
    </Container>
  );
};
export default Notebooks;
