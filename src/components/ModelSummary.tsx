import { Container } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ModelEditor from "./ModelEditor";
import { MicContext } from "../contexts/MicContext";
import { useParams } from "react-router-dom";

type Props = {
  componentId: string;
};

const ModelSummary = () => {
  const props = useParams<Props>()
  const { component, getModel } = useContext(MicContext);
  useEffect(() => {
    getModel(props.componentId)
  }, []);
  return (
    <Container maxWidth="sm">
      <ModelEditor/>
    </Container>
  );
};

export default ModelSummary;
