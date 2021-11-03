import {  Container } from "@mui/material";

import IPython from "./IPython";
import ModelSelector from "./ModelSelector";
import { ContextProvider } from "../contexts/ModelCatalog";

const IPythonModelRegister = () => {
  return (
    <Container component="main" sx={{ mb: 4, display: "flex" }}>
      <ContextProvider>
        <ModelSelector />
        <IPython />
      </ContextProvider>
    </Container>
  );
};

export default IPythonModelRegister;