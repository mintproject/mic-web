import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Parameter } from "../../models/Parameter";

export const createParameters = async (
  modelId: string,
  parameters: Parameter[]
) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${modelId}/parameters`;
  for (const parameter of parameters) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameter),
    });
    if (response.ok) {
      console.log("parameters created");
    }
    throw new Error(response.statusText);
  }
};
