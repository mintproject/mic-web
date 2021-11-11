import { Container } from "@mui/material";

import IPython from "./IPython";
import ModelSelector from "./ModelSelector";

const IPythonModelRegister = () => {
  return (
    <Container component="main" sx={{ mb: 4, display: "flex" }}>
      <ModelSelector />
    </Container>
  );
};

export default IPythonModelRegister;
