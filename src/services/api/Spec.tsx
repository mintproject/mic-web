import { REACT_APP_MIC_API } from "../../constants/environment";
import { CommandLineObject } from "../../models/cwl/cwl";

export const createSpec = async (modelId: string, spec: CommandLineObject) => {
  const url = `${REACT_APP_MIC_API}/models/${modelId}/cwlspec`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spec),
  });
};
