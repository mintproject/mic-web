import { REACT_APP_MIC_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Parameter } from "../../models/Parameter";

export const createParameters = async (modelId: string, parameters: Parameter[]) => {
    const url = `${REACT_APP_MIC_API}${COMPONENTS_URL}/${modelId}/parameters`;
    const promises = parameters.map((parameter) => {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parameter),
        });
    });
    const data = await Promise.all(promises);
    data.forEach((item) => {
        if (!item.ok) {
            throw new Error(`Error creating parameter: ${item.statusText}`);
        }
    });
};

export const deleteParameters = async (modelId: string) => {
    const url = `${REACT_APP_MIC_API}${COMPONENTS_URL}/${modelId}/parameters`;
    const response = await fetch(url, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Error deleting parameters: ${response.statusText}`);
    }
};
