import { REACT_APP_MIC_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Directive } from "../../models/Directive";

export const getDirectives = async (modelId: string) => {
  const url = `${REACT_APP_MIC_API}/models/${modelId}/directives`;
  const response = await fetch(url);
  if (response.ok) {
    const data: Directive[] = await response.json();
    return data;
  }
  throw new Error(response.statusText);
};

export const createDirective = async (modelId: string, command: string) => {
  const url = `${REACT_APP_MIC_API}/${COMPONENTS_URL}/directives`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: command,
      modelId: modelId,
    }),
  });
  if (response.ok) {
    const data: Directive = await response.json();
    return data;
  }
  throw new Error(response.statusText);
};
