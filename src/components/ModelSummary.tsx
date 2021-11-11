import { Container } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import ModelEditor from "./ModelEditor";
import { MicContext } from "../contexts/MicContext";

type Props = {
  id: string;
};

const ModelSummary = (props: Props) => {
  const { model, setModel, setId } = useContext(MicContext);
  useEffect(() => {
    setId(props.id);
  }, []);
  return (
    <Container maxWidth="sm">
      {model && <ModelEditor/>}
    </Container>
  );
};

export default ModelSummary;
