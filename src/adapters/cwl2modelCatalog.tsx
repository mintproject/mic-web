import { CommandLineObject } from "../models/cwl/cwl";
import { Input } from "../models/Input";
import { Parameter } from "../models/Parameter";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const getParametersCwl = (data: CommandLineObject): Parameter[] => {
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type !== "File") {
        return {
          name: key,
          displayName: key,
          description: key,
          prefix: value?.inputBinding.prefix,
          type: value?.type,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}

export const getFilesCwl = (data: CommandLineObject): Input[] => {
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type === "File") {
        return {
          name: key,
          displayName: key,
          description: key,
          prefix: value?.inputBinding.prefix,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}
