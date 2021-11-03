import React, { useState, useEffect, createContext, FC } from "react";
import {
  Model,
  ModelApi,
  SoftwareVersionApi,
  Configuration,
  ModelCategory,
  ModelCategoryApi,
  SoftwareVersion,
  VisualizationsIdDeleteRequest,
  Software,
} from "@mintproject/modelcatalog_client";

interface ModelContext {
  models: Model[];
  versions: SoftwareVersion[];
  categories: ModelCategory[];
  selectedModel: Model | undefined;
  selectedVersion: SoftwareVersion | undefined;
  loadingMC: boolean;
  setSelectedModel: (value: Model | undefined) => void;
  setSelectedVersion: (value: SoftwareVersion | undefined) => void;
}

const defaultState = {
  models: [],
  versions: [],
  categories: [],
  loadingMC: true,
  selectedModel: [] as Model,
  selectedVersion: [] as SoftwareVersion,
  setSelectedModel: (value: Model | undefined) => {},
  setSelectedVersion: (value: SoftwareVersion | undefined) => {},
};

const Context = createContext<ModelContext>(defaultState);

const ModelContextProvider: FC = ({ children }) => {
  //Model catalog API related
  const [loadingMC, setLoadingMC] = useState(true);
  const [MCUser, setMCUser] = useState("mint@isi.edu");
  const [models, setModels] = useState([] as Model[]);
  const [versions, setVersions] = useState([] as SoftwareVersion[]);
  const [categories, setCategories] = useState([] as ModelCategory[]);
  // Where to store the filtered models and versions
  const [possibleModels, setPossibleModels] = useState([] as Model[]);
  const [possibleVersions, setPossibleVersions] = useState(
    [] as SoftwareVersion[]
  );

  // State
  const [editMode, setEditMode] = useState(true);
  const [creating] = useState(false);

  //selected
  const [selectedModel, setSelectedModel] = useState<Model | undefined>();
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion | undefined>();

  useEffect(() => {
    setMCUser("mint@isi.edu");
    //FIXME add correct dependencies to use effect
    if (models.length + versions.length === 0) {
      setLoadingMC(true);
      // Set the configuration fo the model catalog. FIXME
      let cfg: Configuration = new Configuration({
        basePath: "https://api.models.dev.mint.isi.edu/v1.8.0",
        //accessToken: TOKEN
      });

      // Create APIs and get data
      let mApi = new ModelApi(cfg);
      let cApi = new ModelCategoryApi(cfg);
      let vApi = new SoftwareVersionApi(cfg);

      let pModels: Promise<Model[]> = mApi.modelsGet({ username: MCUser });
      let pCategory: Promise<ModelCategory[]> = cApi.modelcategorysGet({
        username: MCUser,
      });
      let pVersions: Promise<SoftwareVersion[]> = vApi.softwareversionsGet({
        username: MCUser,
      });

      pModels
        .then((models: Model[]) => {
          setModels(models);
          setPossibleModels(models);
          return models;
        })
        .catch((err) => {
          //TODO: handle error
          console.log(err);
        });
      pCategory.then(setCategories).catch((err) => {
        //TODO: handle error
        console.log(err);
      });
      pVersions.then(setVersions).catch((err) => {
        console.log(err);
      });

      Promise.all([pModels, pVersions, pCategory])
        .then(() => setLoadingMC(false))
        .catch((error) => {
          console.warn(error);
        });
    }
  });

  return (
    <Context.Provider
      value={{
        models, 
        versions, 
        categories,
        loadingMC, 
        selectedVersion,
        selectedModel,
        setSelectedModel,
        setSelectedVersion,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ModelContextProvider as ContextProvider, Context };
