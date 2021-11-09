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
  ModelConfiguration,
  ModelConfigurationApi,
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
  saveConfiguration: (value: ModelConfiguration) => void
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
  saveConfiguration: (value: ModelConfiguration) => {}
};

const Context = createContext<ModelContext>(defaultState);

const ModelContextProvider: FC = ({ children }) => {
  //Model catalog API related
  const [MCUser, setMCUser] = useState("mint@isi.edu");

  //States exposed
  const [models, setModels] = useState([] as Model[]);
  const [versions, setVersions] = useState([] as SoftwareVersion[]);
  const [categories, setCategories] = useState([] as ModelCategory[]);
  const [possibleModels, setPossibleModels] = useState([] as Model[]);

  // Fetch and creating status
  const [creating, setCreating] = useState(false);
  const [loadingMC, setLoadingMC] = useState(true);

  //selected
  const [selectedModel, setSelectedModel] = useState<Model | undefined>();
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion | undefined>();
  
  const saveConfiguration = (cfg:ModelConfiguration) => {
    setCreating(true);
    let returnVal = new Promise<ModelConfiguration>((resolve, reject) => {
      if (selectedModel == null || selectedVersion == null) {
        reject("You must first select a model an version")
      } else {
        let cApi : ModelConfigurationApi = new ModelConfigurationApi();
        let vApi : SoftwareVersionApi = new SoftwareVersionApi();
        let mApi : ModelApi = new ModelApi();

        let cProm = cApi.modelconfigurationsPost({user: MCUser, modelConfiguration: cfg});
        cProm.catch(reject);
        cProm.then((realConfig:ModelConfiguration) => {
          //We have the saved configuration.
          if (selectedVersion.id) {
            //Version already exists, get the version and update.
            let gvProm = vApi.softwareversionsIdGet({id: selectedVersion.id, username:MCUser});
            gvProm.catch(reject);
            gvProm.then((sv:SoftwareVersion) => {
              if (sv.hasConfiguration) {
                sv.hasConfiguration.push(realConfig);
              } else {
                sv.hasConfiguration = [realConfig];
              }
              let pvProm = vApi.softwareversionsIdPut({user:MCUser, id:(sv.id as string), softwareVersion: sv});
              pvProm.catch(reject);
              pvProm.then((realV:SoftwareVersion) => {
                resolve(realConfig);
              })
            })
          } else {
            // We need to create the version first
            selectedVersion.hasConfiguration = [realConfig];
            let pvProm = vApi.softwareversionsPost({user:MCUser, softwareVersion: selectedVersion});
            pvProm.catch(reject);
            pvProm.then((newVer:SoftwareVersion) => {
              //As this is a new version, we need to add it to the model:
              if (selectedModel.id) {
                // Get this model and add the version.
                let gmProm = mApi.modelsIdGet({username:MCUser, id:selectedModel.id});
                gmProm.catch(reject);
                gmProm.then((realModel:Model) => {
                  if (realModel.hasVersion) {
                    realModel.hasVersion.push(newVer);
                  } else {
                    realModel.hasVersion = [newVer];
                  }
                  let pmProm = mApi.modelsIdPut({user:MCUser, id:(realModel.id as string), model:realModel});
                  pmProm.catch(reject);
                  pmProm.then((updatedModel:Model) => {
                    resolve(realConfig);
                  })
                });
              } else {
                // Add the model too
                selectedModel.hasVersion = [newVer];
                let postModelProm = mApi.modelsPost({user:MCUser, model: selectedModel});
                postModelProm.catch(reject);
                postModelProm.then((newModel:Model) => {
                  resolve(realConfig)
                })
              }
            });
          }
        })
      }
    });
    returnVal.finally(() => setCreating(false));
    return returnVal;
  }

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
          //return models;
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
        saveConfiguration
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { ModelContextProvider as ContextProvider, Context };
