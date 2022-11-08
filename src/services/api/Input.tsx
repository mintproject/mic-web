import { REACT_APP_MIC_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Input } from "../../models/Input";

export const createInputs = async (modelId: string, inputs: Input[]) => {
    const url = `${REACT_APP_MIC_API}/${COMPONENTS_URL}/${modelId}/inputs`;
    for (const parameter of inputs) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameter),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    }
  };
