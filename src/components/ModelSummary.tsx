import {
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Model} from "../types/mat";
import { MAT_API } from "./environment";
import ModelEditor from "./ModelEditor";

type ModelParameter = {
  modelId: string;
};

const ModelSummary = () => {
  const { modelId } = useParams<ModelParameter>();
  const [model, setModel] = useState<Model>();
  const [isLoading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    fetch(
      `${MAT_API}/models?filter[where][id]=${modelId}&filter[include][]=inputs&filter[include][]=parameters`
    )
      .then((response) => response.json())
      .then((data) => {
        setModel(data[0]);
        setLoading(false);
      });
  }, [modelId]);

  return (
    <Container maxWidth="sm">
      {isLoading && <p>Pending</p>}
      {model && <ModelEditor model={model}/>}
    </Container>
  );
};

export default ModelSummary;
