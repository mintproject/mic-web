import React, { useState, useEffect, createContext, FC, Dispatch} from "react";
import { MAT_API } from "../components/environment";
import { Model } from "../types/mat";

interface MicContextState {
  dark: boolean;
  id: string | undefined;
  model: Model | undefined;
  toggleDark: () => void;
  setModel: Dispatch<React.SetStateAction<Model | undefined>>
  setId: Dispatch<React.SetStateAction<string | undefined>>
}
const defaultState = {
  dark: false,
  id: '',
  model: {} as Model,
  toggleDark: () => {},
  setId: () => {},
  setModel: () => {}
};

const MicContext = createContext<MicContextState>(defaultState);

const MicContextProvider: FC = ({ children }) => {
  const [dark, setDark] = useState(false)
  const [id, setId] = useState<string | undefined>()
  const [model, setModel] = useState<Model>()  

  useEffect(() => {
    const getModels = async () => {
      const response = await fetch(
        `${MAT_API}/models?filter[where][id]=${id}&filter[include][]=inputs&filter[include][]=parameters`
      );
      const data = await response.json();
      setModel(data[0]);
    };
    getModels()
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
        model: model,
        setModel: setModel,
      }}
    >
      {children}
    </MicContext.Provider>
  );
};

export { MicContextProvider as MicContextProvider, MicContext};
