import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Component } from "../../models/Component";
import { replacer } from "../../utils/utils";

export const createComponent = async (component: Component) => {

    const response = await fetch(`${MAT_API}/models`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        type: "docker",
        ...component
    }),
  });
  if (response.ok) {
    const data: Component = await response.json();
    return data;
  } else {
    throw new Error(response.statusText);
  }
};

export const updateComponent = async (component: Component) => {
  const url = `${MAT_API}/${COMPONENTS_URL}${component.id}`;
  const temp = JSON.stringify(component, replacer);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: temp,
  });
  if (response.ok) {
    const data: Component = await response.json();
    return data;
  }
  throw new Error(response.statusText);
}