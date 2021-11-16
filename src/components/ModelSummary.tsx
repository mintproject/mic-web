import { Container } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ModelEditor from "./ModelEditor";
import { MicContext } from "../contexts/MicContext";
import { useParams } from "react-router-dom";

type Props = {
  componentId: string;
};

const ComponentSummary = () => {
  const props = useParams<Props>()
  const { component, setId } = useContext(MicContext);
  useEffect(() => {
    setId(props.componentId);
    console.log(component)
  }, []);
  return (
    <Container maxWidth="sm">
      {component && <ModelEditor/>}
    </Container>
  );
};

export default ComponentSummary;
