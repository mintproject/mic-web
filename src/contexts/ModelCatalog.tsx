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
    ParameterApi,
    DatasetSpecificationApi,
    DatasetSpecification,
    Parameter,
} from "@mintproject/modelcatalog_client";
import { useKeycloak } from "@react-keycloak/web";
import { getIdFromUrl } from "../utils/utils";
import { MODEL_CATALOG_API } from "../constants/environment";
import { VpnKey } from "@mui/icons-material";
import Module from "module";

interface ModelContextState {
    models: Model[];
    versions: SoftwareVersion[];
    categories: ModelCategory[];
    loading: boolean;
    setLoading: Dispatch<React.SetStateAction<boolean>>;
    selectedModel: Model | undefined;
    setSelectedModel: Dispatch<React.SetStateAction<Model | undefined>>;
    selectedVersion: SoftwareVersion | undefined;
    setSelectedVersion: Dispatch<React.SetStateAction<SoftwareVersion | undefined>>;
    saveModelConfigurationFull: (cfg: ModelConfiguration) => void;
    saveConfiguration: (cfg: ModelConfiguration) => Promise<ModelConfiguration>;
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
    saveModelConfigurationFull: (cfg: ModelConfiguration) => {},
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

    const saveVersion = async (modelConfiguration: ModelConfiguration) => {
        let vApi: SoftwareVersionApi = new SoftwareVersionApi(cfg);
        if (selectedModel && selectedVersion) {
            if (selectedVersion.id) {
                const modelVersion = await vApi.softwareversionsIdGet({
                    username: user,
                    id: getIdFromUrl(selectedVersion.id),
                });
                if (modelVersion.hasConfiguration) {
                    modelVersion.hasConfiguration.push(modelConfiguration);
                } else {
                    modelVersion.hasConfiguration = [modelConfiguration];
                }
                return await vApi.softwareversionsIdPut({
                    id: getIdFromUrl(selectedVersion.id),
                    softwareVersion: modelVersion,
                    user: user,
                });
            } else {
                selectedVersion.hasConfiguration = [modelConfiguration];
                return await vApi.softwareversionsPost({
                    softwareVersion: selectedVersion,
                    user: user,
                });
            }
        }
    };

    const saveModel = async (softwareVersion: SoftwareVersion) => {
        let mApi: ModelApi = new ModelApi(cfg);
        if (softwareVersion && selectedModel) {
            if (selectedModel.id) {
                const model = await mApi.modelsIdGet({
                    username: user,
                    id: getIdFromUrl(selectedModel.id),
                });
                if (model.hasVersion) {
                    model.hasVersion.push(softwareVersion);
                } else {
                    model.hasVersion = [softwareVersion];
                }
                return mApi.modelsIdPut({
                    id: getIdFromUrl(selectedModel.id),
                    model: model,
                    user: user,
                });
            } else {
                selectedModel.hasVersion = [softwareVersion];
                return mApi.modelsPost({
                    model: selectedModel,
                    user: user,
                });
            }
        }
    };

    const saveModelConfigurationFull = (modelConfigurationRequest: ModelConfiguration) => {
        const update = async () => {
            setCreating(true);

            const modelConfiguration = await saveConfiguration(modelConfigurationRequest);
            const softwareVersion = await saveVersion(modelConfiguration);
            if (softwareVersion) {
                const model = saveModel(softwareVersion);
                return model;
            }
            setCreating(false);
        };
        return update();
    };

    const saveParameters = async (modelConfiguration: ModelConfiguration) => {
        const api = new ParameterApi(cfg);
        const parameters: Parameter[] = [];
        if (modelConfiguration.hasParameter) {
            for (let i = 0; i < modelConfiguration.hasParameter.length; i++) {
                const param = modelConfiguration.hasParameter[i];
                const p = await api.parametersPost({
                    parameter: param,
                    user: user,
                });
                parameters.push(p);
            }
        }
        return parameters;
    };

    const saveInputs = async (modelConfiguration: ModelConfiguration) => {
        const api = new DatasetSpecificationApi(cfg);
        const inputs: DatasetSpecification[] = [];
        if (modelConfiguration.hasInput) {
            for (let i = 0; i < modelConfiguration.hasInput.length; i++) {
                const input = modelConfiguration.hasInput[i];
                const p = await api.datasetspecificationsPost({
                    datasetSpecification: input,
                    user: user,
                });
                inputs.push(p);
            }
        }
        return inputs;
    };

    const saveOuputs = async (modelConfiguration: ModelConfiguration) => {
        const api = new DatasetSpecificationApi(cfg);
        const outputs: DatasetSpecification[] = [];
        if (modelConfiguration.hasOutput) {
            for (let i = 0; i < modelConfiguration.hasOutput.length; i++) {
                const input = modelConfiguration.hasOutput[i];
                const p = await api.datasetspecificationsPost({
                    datasetSpecification: input,
                    user: user,
                });
                outputs.push(p);
            }
        }
        return outputs;
    };

    const saveConfiguration = async (modelConfiguration: ModelConfiguration) => {
        let cApi: ModelConfigurationApi = new ModelConfigurationApi(cfg);
        modelConfiguration.hasInput = await saveInputs(modelConfiguration);
        modelConfiguration.hasParameter = await saveParameters(modelConfiguration);
        modelConfiguration.hasOutput = await saveOuputs(modelConfiguration);
        return await cApi.modelconfigurationsPost({
            user: user,
            modelConfiguration: modelConfiguration,
        });
    };

    useEffect(() => {
        if (initialized === true && keycloak.authenticated) {
            const tokenParsed = keycloak.idTokenParsed as KeycloakTokenParsedLocal;
            setUser(tokenParsed.email);
            let cfg: Configuration = new Configuration({
                basePath: MODEL_CATALOG_API,
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
                saveModelConfigurationFull: saveModelConfigurationFull,
                saveConfiguration: saveConfiguration,
            }}
        >
            {children}
        </ModelContext.Provider>
    );
};

export { ModelContextProvider as ContextProvider, ModelContext };
