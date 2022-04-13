import { MAT_API } from "../../components/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Input } from "../../models/Input";

export const createInputs = async (modelId: string, inputs: Input[]) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${modelId}/inputs`;
  for (const parameter of inputs) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameter),
    });
    if (response.ok) {
        console.log("inputs created");
    }
    throw new Error(response.statusText);
  }

};
