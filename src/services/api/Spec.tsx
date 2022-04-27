import { MAT_API } from "../../constants/environment";
import { CommandLineObject } from "../../models/cwl/cwl";
import { Notebook } from "../../models/Notebook";
import {parse, stringify} from "yaml";
export const createSpec = async (modelId: string, spec: CommandLineObject) => {
  const url = `${MAT_API}/models/${modelId}/cwlspec`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spec),
  });
};

export const getSpec = async (notebook: Notebook) => {
  const url = notebook.spec;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.text();
    return parse(data) as CommandLineObject;
  }
  throw new Error(response.statusText);
}
