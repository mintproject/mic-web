import { Input } from "../models/Input";
import { Parameter } from "../models/Parameter";

export const inputs2values = (inputs?: Input[], parameters?: Parameter[]) => {
  const fileValues = inputs
    ? inputs.reduce((acc, input) => {
        acc[input.name] = input.path;
        return acc;
      }, {} as any)
    : {};
  const parameterValues = parameters
    ? parameters.reduce((acc, parameter) => {
        acc[parameter.name] = parameter.default;
        return acc;
      }
      , {} as any)
    : {};
  return { ...fileValues, ...parameterValues };
};
