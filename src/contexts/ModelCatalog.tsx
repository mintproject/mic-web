import React, { useState, useEffect, createContext, FC, Dispatch } from "react";
import {
  Model,
  ModelApi,
  SoftwareVersionApi,
  Configuration,
  ModelCategory,
  ModelCategoryApi,
  SoftwareVersion,
  ModelConfiguration,
  ModelConfigurationApi,
} from "@mintproject/modelcatalog_client";
import { useKeycloak } from "@react-keycloak/web";

interface ModelContextState {
  models: Model[];
  versions: SoftwareVersion[];
  categories: ModelCategory[];
  test: string | undefined;
  setTest: Dispatch<React.SetStateAction<string| undefined>>
  selectedModel: Model | undefined
  setSelectedModel: Dispatch<React.SetStateAction<Model | undefined>>
  selectedVersion: SoftwareVersion | undefined
  setSelectedVersion: Dispatch<React.SetStateAction<SoftwareVersion | undefined>>
  saveVersion: () =>  Promise<SoftwareVersion>
}

const defaultState = {
  models: [],
  versions: [],
  categories: [],
  test: '',
  setTest: () => {},
  selectedModel: undefined,
  setSelectedModel: () => {},
  selectedVersion: undefined,
  setSelectedVersion: () => {},
  saveVersion: () => new Promise<SoftwareVersion>(() => {}),
};

interface KeycloakTokenParsedLocal {
  acr?: string;
  aud?: string;
  auth_time?: string;
  azp?: string;
  email: string;
  email_verified?: boolean;
  exp?: number;
}

const ModelContext = createContext<ModelContextState>(defaultState);

const getIdFromUrl = (id: string) => {
  return id.split('/').slice(-1)[0]
}

const ModelContextProvider: FC = ({ children }) => {
  //Model catalog API related
  const [user, setUser] = useState<string | undefined>();
  const [token, setToken] = useState("");
  const [cfg, setCfg] = useState<Configuration | undefined>();
  const { keycloak, initialized } = useKeycloak();
  //States exposed
  const [models, setModels] = useState([] as Model[]);
  const [versions, setVersions] = useState([] as SoftwareVersion[]);
  const [categories, setCategories] = useState([] as ModelCategory[]);
  const [possibleModels, setPossibleModels] = useState([] as Model[]);

  // Fetch and creating status
  const [creating, setCreating] = useState(false);
  const [loadingMC, setLoadingMC] = useState(true);
  const [test, setTest] = useState<string | undefined>();

  //selected
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion>();

  const saveVersion = () => {
    setCreating(true);
    console.log(selectedModel)
    console.log(selectedVersion)

    let returnVal = new Promise<SoftwareVersion>((resolve, reject) => {
      if (selectedModel == null || selectedVersion == null) {
        reject("You must first select a model an version");
      } else {
        let vApi: SoftwareVersionApi = new SoftwareVersionApi(cfg);
        let mApi: ModelApi = new ModelApi(cfg);
        if (selectedVersion.id) {
          //Version already exists, get the version and update.
          console.log("version exists");
        } else {
          // We need to create the version first
          let pvProm = vApi.softwareversionsPost({
            user: user,
            softwareVersion: selectedVersion,
          });
          pvProm.catch(reject);
          pvProm.then((newVer: SoftwareVersion) => {
            //As this is a new version, we need to add it to the model:
            if (selectedModel.id) {
              // Get this model and add the version.
              let gmProm = mApi.modelsIdGet({
                username: user,
                id: getIdFromUrl(selectedModel.id),
              });
              gmProm.catch(reject);
              gmProm.then((realModel: Model) => {
                if (realModel.hasVersion) {
                  realModel.hasVersion.push(newVer);
                } else {
                  realModel.hasVersion = [newVer];
                }
                let pmProm = mApi.modelsIdPut({
                  user: user,
                  id: getIdFromUrl(realModel.id as string),
                  model: realModel,
                });
                pmProm.catch(reject);
                pmProm.then((updatedModel: Model) => {
                  resolve(newVer);
                });
              });
            } else {
              // Add the model too
              selectedModel.hasVersion = [newVer];
              let postModelProm = mApi.modelsPost({
                user: user,
                model: selectedModel,
              });
              postModelProm.catch(reject);
              postModelProm.then((newModel: Model) => {
                resolve(newVer);
              });
            }
          });
        }
        //})
      }
    });
    returnVal.finally(() => setCreating(false));
    return returnVal;
  };

  const saveConfiguration = (cfg: ModelConfiguration) => {
    setCreating(true);
    let returnVal = new Promise<ModelConfiguration>((resolve, reject) => {
      if (selectedModel == null || selectedVersion == null) {
        reject("You must first select a model an version");
      } else {
        let cApi: ModelConfigurationApi = new ModelConfigurationApi();
        let vApi: SoftwareVersionApi = new SoftwareVersionApi();
        let mApi: ModelApi = new ModelApi();

        let cProm = cApi.modelconfigurationsPost({
          user: user,
          modelConfiguration: cfg,
        });
        cProm.catch(reject);
        cProm.then((realConfig: ModelConfiguration) => {
          //We have the saved configuration.
          if (selectedVersion.id) {
            //Version already exists, get the version and update.
            let gvProm = vApi.softwareversionsIdGet({
              id: selectedVersion.id,
              username: user,
            });
            gvProm.catch(reject);
            gvProm.then((sv: SoftwareVersion) => {
              if (sv.hasConfiguration) {
                sv.hasConfiguration.push(realConfig);
              } else {
                sv.hasConfiguration = [realConfig];
              }
              let pvProm = vApi.softwareversionsIdPut({
                user: user,
                id: sv.id as string,
                softwareVersion: sv,
              });
              pvProm.catch(reject);
              pvProm.then((realV: SoftwareVersion) => {
                resolve(realConfig);
              });
            });
          } else {
            // We need to create the version first
            selectedVersion.hasConfiguration = [realConfig];
            let pvProm = vApi.softwareversionsPost({
              user: user,
              softwareVersion: selectedVersion,
            });
            pvProm.catch(reject);
            pvProm.then((newVer: SoftwareVersion) => {
              //As this is a new version, we need to add it to the model:
              if (selectedModel.id) {
                // Get this model and add the version.
                let gmProm = mApi.modelsIdGet({
                  username: user,
                  id: selectedModel.id,
                });
                gmProm.catch(reject);
                gmProm.then((realModel: Model) => {
                  if (realModel.hasVersion) {
                    realModel.hasVersion.push(newVer);
                  } else {
                    realModel.hasVersion = [newVer];
                  }
                  let pmProm = mApi.modelsIdPut({
                    user: user,
                    id: realModel.id as string,
                    model: realModel,
                  });
                  pmProm.catch(reject);
                  pmProm.then((updatedModel: Model) => {
                    resolve(realConfig);
                  });
                });
              } else {
                // Add the model too
                selectedModel.hasVersion = [newVer];
                let postModelProm = mApi.modelsPost({
                  user: user,
                  model: selectedModel,
                });
                postModelProm.catch(reject);
                postModelProm.then((newModel: Model) => {
                  resolve(realConfig);
                });
              }
            });
          }
        });
      }
    });
    returnVal.finally(() => setCreating(false));
    return returnVal;
  };

  useEffect(() => {
    if (initialized === true && keycloak.authenticated)  {
      const tokenParsed = keycloak.idTokenParsed as KeycloakTokenParsedLocal;
      setUser(tokenParsed.email);
      setToken(keycloak.idToken as string);
      let cfg: Configuration = new Configuration({
        basePath: "https://api.models.dev.mint.isi.edu/v1.8.0",
        accessToken: keycloak.idToken,
      });
      setCfg(cfg);
    }
  }, [initialized]);

  useEffect(() => {
    //FIXME add correct dependencies to use effect
    if (user !== undefined) {
      if (models.length + versions.length === 0) {
        setLoadingMC(true);
        // Create APIs and get data
        let mApi = new ModelApi(cfg);
        let cApi = new ModelCategoryApi(cfg);
        let vApi = new SoftwareVersionApi(cfg);
        console.log(user);
        let pModels: Promise<Model[]> = mApi.modelsGet({ username: user });
        let pCategory: Promise<ModelCategory[]> = cApi.modelcategorysGet({
          username: user,
        });
        let pVersions: Promise<SoftwareVersion[]> = vApi.softwareversionsGet({
          username: user,
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
    }
  }, [user]);

  return (
    <ModelContext.Provider
      value={{
        models: models,
        versions: versions,
        categories: categories,
        test: test,
        setTest: setTest,
        selectedModel: selectedModel,
        setSelectedModel: setSelectedModel,
        selectedVersion: selectedVersion,
        setSelectedVersion: setSelectedVersion,
        saveVersion: saveVersion
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export { ModelContextProvider as ContextProvider, ModelContext };
