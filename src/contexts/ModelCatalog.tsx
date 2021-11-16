import React, { useState, useEffect, createContext, FC, Dispatch } from "react";
import {
  Model,
  ModelApi,
  SoftwareVersionApi,
  Configuration,
  ModelCategory,
  ModelCategoryApi,
  SoftwareVersion,
  ModelConfigurationApi,
  ModelConfiguration,
} from "@mintproject/modelcatalog_client";
import { useKeycloak } from "@react-keycloak/web";
import { getIdFromUrl } from "../utils/utils";

interface ModelContextState {
  models: Model[];
  versions: SoftwareVersion[];
  categories: ModelCategory[];
  loading: boolean;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
  selectedModel: Model | undefined;
  setSelectedModel: Dispatch<React.SetStateAction<Model | undefined>>;
  selectedVersion: SoftwareVersion | undefined;
  setSelectedVersion: Dispatch<
    React.SetStateAction<SoftwareVersion | undefined>
  >;
  saveVersion: () => Promise<SoftwareVersion>;
  saveConfiguration: (cfg: ModelConfiguration, version_id: string) => Promise<ModelConfiguration>;
}

const defaultState = {
  models: [],
  versions: [],
  categories: [],
  loading: false,
  setLoading: () => {},
  selectedModel: undefined,
  setSelectedModel: () => {},
  selectedVersion: undefined,
  setSelectedVersion: () => {},
  saveVersion: () => new Promise<SoftwareVersion>(() => {}),
  saveConfiguration: () => new Promise<ModelConfiguration>(() => {}),
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

const ModelContextProvider: FC = ({ children }) => {
  //Model catalog API related
  const [user, setUser] = useState<string | undefined>();
  const [cfg, setCfg] = useState<Configuration | undefined>();
  const { keycloak, initialized } = useKeycloak();
  //States exposed
  const [models, setModels] = useState([] as Model[]);
  const [versions, setVersions] = useState([] as SoftwareVersion[]);
  const [categories, setCategories] = useState([] as ModelCategory[]);

  // Fetch and creating status
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  //selected
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion>();

  const saveVersion = () => {
    setCreating(true);
    let returnVal = new Promise<SoftwareVersion>((resolve, reject) => {
      if (selectedModel == null || selectedVersion == null) {
        reject("You must first select a model an version");
      } else {
        let vApi: SoftwareVersionApi = new SoftwareVersionApi(cfg);
        let mApi: ModelApi = new ModelApi(cfg);
        if (selectedVersion.id) {
          //Version already exists, get the version and update.
          resolve(selectedVersion);
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

  const saveConfiguration = (
    modelConfiguration: ModelConfiguration,
    version_id: string
  ) => {
    setCreating(true);
    let returnVal = new Promise<ModelConfiguration>((resolve, reject) => {
      let cApi: ModelConfigurationApi = new ModelConfigurationApi(cfg);
      let vApi: SoftwareVersionApi = new SoftwareVersionApi(cfg);

      let cProm = cApi.modelconfigurationsPost({
        user: user,
        modelConfiguration: modelConfiguration,
      });
      cProm.catch(reject);
      cProm.then((realConfig: ModelConfiguration) => {
        //We have the saved configuration.
        if (version_id) {
          //Version already exists, get the version and update.
          let gvProm = vApi.softwareversionsIdGet({
            id: version_id,
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
              id: getIdFromUrl(sv.id as string),
              softwareVersion: sv,
            });
            pvProm.catch(reject);
            pvProm.then((realV: SoftwareVersion) => {
              resolve(realConfig);
            });
          });
        }
      });
    });
    returnVal.finally(() => setCreating(false));
    return returnVal;
  };

  useEffect(() => {
    if (initialized === true && keycloak.authenticated) {
      const tokenParsed = keycloak.idTokenParsed as KeycloakTokenParsedLocal;
      setUser(tokenParsed.email);
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
        setLoading(true);
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
          .then(() => setLoading(false))
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
        loading: loading,
        setLoading: setLoading,
        selectedModel: selectedModel,
        setSelectedModel: setSelectedModel,
        selectedVersion: selectedVersion,
        setSelectedVersion: setSelectedVersion,
        saveVersion: saveVersion,
        saveConfiguration: saveConfiguration,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export { ModelContextProvider as ContextProvider, ModelContext };
