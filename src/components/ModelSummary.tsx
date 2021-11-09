import { Container } from "@mui/material";
import { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import { Model } from "../types/mat";
import { MAT_API } from "./environment";
import ModelEditor from "./ModelEditor";

type ModelParameter = {
  modelId: string;
};

const ModelSummary = (props: ModelParameter) => {
  const { modelId } = props
  const [model, setModel] = useState<Model>();
  const [isLoading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const getModels = async () => {
      const response = await fetch(
        `${MAT_API}/models?filter[where][id]=${modelId}&filter[include][]=inputs&filter[include][]=parameters`
      );
      const data = await response.json();
      setModel(data[0]);
      setLoading(false);
    };
    getModels()
  }, [modelId]);

  return (
    <Container maxWidth="sm">
      {isLoading && <p>Pending</p>}
      {model && <ModelEditor model={model} />}
    </Container>
  );
};

export default ModelSummary;
