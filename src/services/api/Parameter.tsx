import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Parameter } from "../../models/Parameter";


export const deleteParameters = async (
  componentId: string,
) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${componentId}/parameters`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw Error(error!.message);
    }
};



export const createParameters = async (
  componentId: string,
  parameters: Parameter[]
) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${componentId}/parameters`;
  parameters.map(async (input) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw Error(error!.message);
    }
  });
};
