import React, { useState, useEffect, createContext, FC, Dispatch} from "react";
import { MAT_API } from "../components/environment";
import { Model } from "../types/mat";

interface MicContextState {
  dark: boolean;
  id: string | undefined;
  component: Model | undefined;
  toggleDark: () => void;
  setComponent: Dispatch<React.SetStateAction<Model | undefined>>
  setId: Dispatch<React.SetStateAction<string | undefined>>
}

const defaultState = {
  dark: false,
  id: '',
  component: {} as Model,
  toggleDark: () => {},
  setId: () => {},
  setComponent: () => {}
};

const MicContext = createContext<MicContextState>(defaultState);

const MicContextProvider: FC = ({ children }) => {
  const [dark, setDark] = useState(false)
  const [id, setId] = useState<string | undefined>()
  const [component, setComponent] = useState<Model>()  

  useEffect(() => {
    const getModels = async () => {
      const response = await fetch(
        `${MAT_API}/models?filter[where][id]=${id}&filter[include][]=inputs&filter[include][]=parameters`
      );
      const data = await response.json();
      setComponent(data[0]);
    };
    getModels()
    console.log(component);
  }, [id])
  
  const toggleDark = () => {
    setDark(prevState => !dark)
    console.log(dark)
  }
  
  return (
    <MicContext.Provider
      value={{
        dark: dark,
        toggleDark: toggleDark,
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

export { MicContextProvider, MicContext};
