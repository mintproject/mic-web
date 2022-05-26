import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Component } from "../models/Component";
import { getComponent } from "../services/api/Component";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TrendingUpRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
import { inputs2values } from "../adapters/modelCatalog2cwl";
interface Params {
  id: string;
}

const SampleExecution = () => {
  const { id } = useParams<Params>();
  const [component, setComponent] = useState<Component>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [parametersNotValid, setParametersNotValid] = useState<boolean>(true);
  const [inputsNotValid, setInputsNotValid] = useState<boolean>(true);

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

  useEffect(() => {
    if (component) {
      component.parameters &&
      component.parameters.find((parameter) => parameter.default === null)
        ? setParametersNotValid(true)
        : setParametersNotValid(false);
      component.inputs && component.inputs?.find((input) => input.path === null)
        ? setInputsNotValid(true)
        : setInputsNotValid(false);
    }
  }, [component]);

  return (
    <div>
      <Typography variant="h4" sx={{ my: { xs: 2, md: 3 } }}>
        Let's test your notebook
      </Typography>

      {error ? (
        <Typography variant="h6" sx={{ color: "red" }}>
          <ErrorIcon />
          {error}
        </Typography>
      ) : (
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Select Parameters
              </Typography>
              {parametersNotValid ? (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <ErrorIcon /> Missing values
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <DoneIcon /> All values are set
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {component?.parameters?.map((parameter) => (
                    <TableRow key={parameter.name}>
                      <TableCell>{parameter.name}</TableCell>
                      <TableCell>{parameter.type}</TableCell>
                      <TableCell>
                        <TextField
                          value={parameter.default}
                          onChange={(e) => {
                            parameter.default = e.target.value;
                            setComponent((component) => {
                              return {
                                ...component,
                                parameters: component!.parameters?.map(
                                  (item) => {
                                    if (item.id === parameter.id) {
                                      return parameter;
                                    }
                                    return item;
                                  }
                                ),
                              };
                            });
                            console.log(component);
                            setParametersNotValid(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Select Inputs Files
              </Typography>
              {inputsNotValid ? (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <ErrorIcon /> Missing values
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <DoneIcon /> All values are set
                </Box>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>URL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {component?.inputs?.map((input) => (
                    <TableRow key={input.name}>
                      <TableCell>{input.name}</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={input.path}
                          onChange={(e) => {
                            input.path = e.target.value;
                            setComponent((component) => {
                              return {
                                ...component,
                                inputs: component!.inputs?.map((item) => {
                                  if (item.id === input.id) {
                                    return input;
                                  }
                                  return item;
                                }),
                              };
                            });
                            console.log(component);
                            setParametersNotValid(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disabled={parametersNotValid && inputsNotValid}
              variant="contained"
              color="primary"
              onClick={() => {
                setLoading(true);
                const values = inputs2values(
                  component!.inputs,
                  component!.parameters
                );
                console.log(values);
              }}
            >
              Run
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default SampleExecution;
