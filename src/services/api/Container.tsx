import { REACT_APP_MIC_API} from "../../constants/environment";
import { Container } from "../../models/Container";

export const createContainer = async (id: string, image_name: string) => {
  const response = await fetch(`${REACT_APP_MIC_API}/models/${id}/container`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: image_name,
    }),
  });
  if (response.ok) {
    const data: Container = await response.json();
    return data;
  } else {
    throw new Error(response.statusText);
  }
};


export const getContainer = async (containerId: string) => {
  const response = await fetch(`${REACT_APP_MIC_API}/containers/${containerId}`);
  if (response.ok) {
    const data = response.json();
    return data;
  }
  throw new Error(response.statusText);

}



