import React, { useState, useEffect, createContext, FC, Dispatch } from "react";
import { MAT_API } from "../constants/environment";
import { Component } from "../models/Component";

interface MicContextState {
  dark: boolean;
  id: string | undefined;
  component: Component | undefined;
  getModel: (id: string) => void;
  setComponent: Dispatch<React.SetStateAction<Component | undefined>>;
  setId: Dispatch<React.SetStateAction<string | undefined>>;
}

const defaultState = {
  dark: false,
  id: "",
  component: {} as Component,
  getModel: () => {},
  setId: () => {},
  setComponent: () => {},
};

const MicContext = createContext<MicContextState>(defaultState);

const MicContextProvider: FC = ({ children }) => {
  const [dark, setDark] = useState(false);
  const [id, setId] = useState<string | undefined>();
  const [component, setComponent] = useState<Component>();

  const getModel = async (id: string) => {
    const response = await fetch(
      `${MAT_API}/models/${id}/?filter=%7B%0A%20%20%22include%22%3A%20%5B%0A%20%20%20%20%20%22inputs%22%2C%20%22parameters%22%2C%20%22outputs%22%0A%20%20%5D%0A%7D`
    );
    const data = await response.json();
    const temporal : Component = data
    setComponent(temporal);
  };

  return (
    <MicContext.Provider
      value={{
        dark: dark,
        getModel: getModel,
        id: id,
        setId: setId,
        component: component,
        setComponent: setComponent,
      }}
    >
      {children}
    </MicContext.Provider>
  );
};

export { MicContextProvider, MicContext };
