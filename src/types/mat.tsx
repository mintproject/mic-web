import { MAT_API } from "../components/environment";
import { CommandLineObject } from "./cwl";
export interface Model {
  id?: string;
  name?: string;
  display_name?: string;
  description?: string;
  type?: string;
  cwlspec?: CommandLineObject;
  docker_image?: string;
  parameters?: Parameter[];
  inputs?: Input[];
  container?: Container;
  directives?: Directive[];
  model_id?: string;
  version_id?: string;
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

export interface Container {
  id?: string;
  name?: string;
  image?: string;
  launched_at?: string;
  host?: string;
  port?: string;
  docker_id?: string;
  modelId?: string;
}

export interface Directive {
  id?: string;
  command?: string;
  modelId?: string;
  created_at?: Date;
}

export const createSpec = async (modelId: string, spec: CommandLineObject) => {
  const url = `${MAT_API}/models/${modelId}/cwlspec`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spec),
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (spec: CommandLineObject) => {
  const username = "upload";
  const password = "HVmyqAPWDNuk5SmkLOK2";
  try {
    fetch("https://publisher.mint.isi.edu", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spec), // This is your file object
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const createParameters = async (
  modelId: string,
  parameters: Parameter[]
) => {
  const url = `${MAT_API}/models/${modelId}/parameters`;
  try {
    for (const parameter of parameters) {
      await fetch(url, {
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

export function getContainer(containerId: string) {
  return fetch(`${MAT_API}/containers/${containerId}`);
}

export function getDirectives(modelId: string) {
  const url = `${MAT_API}/models/${modelId}/directives`;
  return fetch(url);
}

export function createDirective(modelId: string, command: string) {
  const url = `${MAT_API}/models/${modelId}/directives`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command: command,
      modelId: modelId,
    }),
  });
}

export const createInputs = async (modelId: string, inputs: Input[]) => {
  const url = `${MAT_API}/models/${modelId}/inputs`;
  try {
    for (const parameter of inputs) {
      await fetch(url, {
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
