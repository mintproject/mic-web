import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Input } from "../../models/Input";
export const deleteInputs = async (componentId: string) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${componentId}/inputs`;
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

export const createInputs = async (componentId: string, inputs: Input[]) => {
  const url = `${MAT_API}/${COMPONENTS_URL}/${componentId}/inputs`;
  inputs.map(async (input) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      if (! response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw Error(error!.message);
    }
  });
};
