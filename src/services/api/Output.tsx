
import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Output } from "../../models/Output";

export const createOutputs = async (modelId: string, outputs: Output[]) => {
    const url = `${MAT_API}/${COMPONENTS_URL}/${modelId}/outputs`;
    for (const parameter of outputs) {
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