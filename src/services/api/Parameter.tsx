import { REACT_APP_MIC_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Parameter } from "../../models/Parameter";

export const createParameters = async (modelId: string, parameters: Parameter[]) => {
    const url = `${REACT_APP_MIC_API}${COMPONENTS_URL}/${modelId}/parameters`;
    for (const parameter of parameters) {
        console.log("parameter", parameter);
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
