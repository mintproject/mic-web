import {
    ModelConfiguration,
    SoftwareImageApi,
    SoftwareImage,
    ParameterApi,
    Parameter,
    DatasetSpecificationApi,
    DatasetSpecification,
    ModelConfigurationApi,
    Configuration,
    ModelApi,
    SoftwareVersion,
    SoftwareVersionApi,
    Model,
    ModelCategory,
    ModelCategoryApi,
} from "@mintproject/modelcatalog_client";
import { getIdFromUrl } from "../utils/utils";

const saveSoftwareImage = async (modelConfiguration: ModelConfiguration, cfg: Configuration, user: string) => {
    const mApi: SoftwareImageApi = new SoftwareImageApi(cfg);
    const promises: Promise<SoftwareImage>[] = [];

    if (modelConfiguration.hasSoftwareImage) {
        for (let i = 0; i < modelConfiguration.hasSoftwareImage.length; i++) {
            const si = modelConfiguration.hasSoftwareImage[i];
            if (si.id) {
                promises.push(
                    mApi.softwareimagesIdGet({
                        username: user,
                        id: getIdFromUrl(si.id),
                    })
                );
            } else {
                promises.push(
                    mApi.softwareimagesPost({
                        softwareImage: si,
                        user: user,
                    })
                );
            }
        }
    }
    return Promise.all(promises);
};

const saveParameters = async (modelConfiguration: ModelConfiguration, cfg: Configuration, user: string) => {
    const api = new ParameterApi(cfg);
    const results: Parameter[] = [];
    const promises: Promise<Parameter>[] = [];
    if (modelConfiguration.hasParameter) {
        for (let i = 0; i < modelConfiguration.hasParameter.length; i++) {
            const param = modelConfiguration.hasParameter[i];
            param.position = [i + 1];
            promises.push(
                api.parametersPost({
                    parameter: param,
                    user: user,
                })
            );
        }
        const data = await Promise.all(promises);
        for (let i = 0; i < data.length; i++) {
            results.push(data[i]);
        }
    }
    return results;
};

const saveInputs = async (modelConfiguration: ModelConfiguration, cfg: Configuration, user: string) => {
    const api = new DatasetSpecificationApi(cfg);
    const results: DatasetSpecification[] = [];
    const promises: Promise<DatasetSpecification>[] = [];
    if (modelConfiguration.hasInput) {
        for (let i = 0; i < modelConfiguration.hasInput.length; i++) {
            const input = modelConfiguration.hasInput[i];
            input.position = [i + 1];
            promises.push(
                api.datasetspecificationsPost({
                    datasetSpecification: input,
                    user: user,
                })
            );
        }
        const data = await Promise.all(promises);
        for (let i = 0; i < data.length; i++) {
            results.push(data[i]);
        }
    }
    return results;
};

const saveOutputs = async (modelConfiguration: ModelConfiguration, cfg: Configuration, user: string) => {
    const api = new DatasetSpecificationApi(cfg);
    const outputs: DatasetSpecification[] = [];
    const promises: Promise<DatasetSpecification>[] = [];
    if (modelConfiguration.hasOutput) {
        for (let i = 0; i < modelConfiguration.hasOutput.length; i++) {
            const input = modelConfiguration.hasOutput[i];
            input.position = [i + 1];
            promises.push(
                api.datasetspecificationsPost({
                    datasetSpecification: input,
                    user: user,
                })
            );
            const data = await Promise.all(promises);
            for (let i = 0; i < data.length; i++) {
                outputs.push(data[i]);
            }
        }
    }
    return outputs;
};

const saveConfiguration = async (modelConfiguration: ModelConfiguration, cfg: Configuration, user: string) => {
    let cApi: ModelConfigurationApi = new ModelConfigurationApi(cfg);
    modelConfiguration.hasInput = await saveInputs(modelConfiguration, cfg, user);
    modelConfiguration.hasParameter = await saveParameters(modelConfiguration, cfg, user);
    modelConfiguration.hasOutput = await saveOutputs(modelConfiguration, cfg, user);
    modelConfiguration.hasSoftwareImage = await saveSoftwareImage(modelConfiguration, cfg, user);
    modelConfiguration = await cApi.modelconfigurationsPost({
        user: user,
        modelConfiguration: modelConfiguration,
    });
    return modelConfiguration;
};

const saveVersion = async (
    modelConfiguration: ModelConfiguration,
    cfg: Configuration,
    user: string,
    selectedModel: Model,
    selectedVersion: SoftwareVersion
) => {
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

const getModels = async (cfg: Configuration, user: string) => {
    let mApi: ModelApi = new ModelApi(cfg);
    return await mApi.modelsGet({ username: user });
};

const getVersions = async (cfg: Configuration, user: string) => {
    let vApi: SoftwareVersionApi = new SoftwareVersionApi(cfg);
    return await vApi.softwareversionsGet({ username: user });
};

const getCategories = async (cfg: Configuration, user: string) => {
    let cApi: ModelCategoryApi = new ModelCategoryApi(cfg);
    return await cApi.modelcategorysGet({ username: user });
};

const saveModel = async (softwareVersion: SoftwareVersion, selectedModel: Model, cfg: Configuration, user: string) => {
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

export { saveConfiguration, saveVersion, getModels, getVersions, getCategories, saveModel };
