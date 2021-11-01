import { MAT_API } from "../components/environment";
import { CommandLineObject } from "./cwl";
export interface Model {
  id?: string;
  name?: string;
  display_name?: string;
  description?: string;
  type?: string;
  cwl_spec?: CommandLineObject;
  docker_image?: string;
  parameters?: Parameter[];
  inputs?: Input[];
}

export interface Parameter {
  id?: string;
  name: string;
  display_name?: string;
  description?: string;
  type?: string;
  unit?: string;
  unit_description?: string;
  data_type?: string;
  default?: Number | string | boolean;
  choices?: string[];
  min?: Number;
  max?: Number;
  prefix?: string;
}

export interface Input {
  id?: string;
  name: string;
  description?: string;
  display_name?: string;
  path?: string;
  prefix?: string;
}

export const createParameters = async (
  modelId: string,
  parameters: Parameter[]
) => {
  const url = `${MAT_API}/models/${modelId}/parameters`;
  try {
    for (const parameter of parameters) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameter),
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const createInputs = async (modelId: string, inputs: Input[]) => {
  const url = `${MAT_API}/models/${modelId}/inputs`;
  try {
    for (const parameter of inputs) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameter),
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};
