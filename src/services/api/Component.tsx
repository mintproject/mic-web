import { MAT_API } from "../../constants/environment";
import { COMPONENTS_URL } from "../../constants/routes";
import { Component } from "../../models/Component";
import { replacer } from "../../utils/utils";

export const createComponent = async (
  component: Component,
  gitUrl?: string
) => {
  try {
    const response = await fetch(`${MAT_API}${COMPONENTS_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...component,
      }),
    });
    if (response.ok) {
      const data: Component = await response.json();
      if (gitUrl) {
        const responseRepo = await fetch(
          `${MAT_API}${COMPONENTS_URL}/${data.id}/git-repo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: gitUrl,
            }),
          }
        );
        if (responseRepo.ok) {
          return { ...data, gitRepo: await responseRepo.json() };
        }
      }
      return data;
    }
    throw Error(response.statusText);
  } catch (error) {
    throw Error(error!.message);
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
};

export const getComponent = async (id: string) => {
  try {
    const params = new URLSearchParams({
      filter: `{"include":[{"relation":"gitRepo","scope":{"fields":{"name":false},"include":[{"relation":"notebooks"}]}}]}`
    });
    const response = await fetch(`${MAT_API}${COMPONENTS_URL}/${id}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data: Component = await response.json();
      return data;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error!.message);
  }
};

export const listComponents = async () => {
  try {
    const response = await fetch(`${MAT_API}${COMPONENTS_URL}`);
    if (response.ok) {
      const data: Component[] = await response.json();
      return data;
    }
    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(error!.message);
  }
};
