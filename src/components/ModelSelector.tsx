import { Button, Container, Paper, Typography, InputLabel, Select, SelectChangeEvent, MenuItem, CircularProgress, Link } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Model, SoftwareVersion, ModelCategory, ModelConfiguration, Configuration } from "@mintproject/modelcatalog_client";
import Box from "@mui/material/Box";
import isUrl from "validator/lib/isURL";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Redirect } from "react-router-dom";
import { getIdFromUrl } from "../utils/utils";
import { convertModelConfiguration } from "../adapters/modelCatalog";
import { Component } from "../models/Component";
import { REACT_APP_MODEL_CATALOG_API } from "../constants/environment";
import { getCategories, getModels, getVersions, saveConfiguration, saveModel, saveVersion } from "../services/ModelCatalogService";
import { useKeycloak } from "@react-keycloak/web";

interface Props {
    component: Component;
    modelConfiguration: ModelConfiguration;
}

interface KeycloakTokenParsedLocal {
    acr?: string;
    aud?: string;
    auth_time?: string;
    azp?: string;
    email: string;
    email_verified?: boolean;
    exp?: number;
}

const ModelSelector = (props: Props) => {
    const [models, setModels] = useState<Model[]>([]);
    const [versions, setVersions] = useState<SoftwareVersion[]>([]);
    const [categories, setCategories] = useState<ModelCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);
    const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion | undefined>(undefined);
    const [username, setUsername] = useState<string>("");
    const [cfg, setCfg] = useState<Configuration>();
    const [modelConfigurationUrl, setModelConfigurationUrl] = useState<string>("");
    const [modelName, setModelName] = useState("");
    const [modelDescription, setModelDescription] = useState("");
    const [versionNumber, setVersionNumber] = useState("");
    const [categoryUrl, setCategoryUrl] = useState("-");
    const [possibleModels, setPossibleModels] = useState([] as Model[]);
    const [possibleVersions, setPossibleVersions] = useState([] as SoftwareVersion[]);
    const [modelUrl, setModelUrl] = useState("");
    const [versionUrl, setVersionUrl] = useState("");
    const mintModelCatalogUrl = new URL(REACT_APP_MODEL_CATALOG_API);
    const mintUiUrl: string = `${mintModelCatalogUrl.protocol}//${mintModelCatalogUrl.hostname.replace("api.models.", "")}`;
    const { keycloak, initialized } = useKeycloak();
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (initialized === true && keycloak.authenticated) {
            const tokenParsed = keycloak.idTokenParsed as KeycloakTokenParsedLocal;
            setUsername(tokenParsed.email);
            let cfg: Configuration = new Configuration({
                basePath: REACT_APP_MODEL_CATALOG_API,
                accessToken: keycloak.idToken,
            });
            setCfg(cfg);
        }
    }, [initialized]);

    useEffect(() => {
        const fetch = async () => {
            if (cfg && username && models.length + versions.length === 0) {
                setLoading(true);
                const m = await getModels(cfg, username);
                const v = await getVersions(cfg, username);
                const c = await getCategories(cfg, username);
                setModels(m);
                setVersions(v);
                setCategories(c);
                setLoading(false);
            }
        };
        fetch();
    }, [cfg, username]);

    // handle events
    useEffect(() => {
        if (!(modelName === "" && modelDescription === "")) {
            const newModel: Model = {
                label: [modelName],
                description: [modelDescription],
                hasModelCategory: [{ id: categoryUrl }],
            };
            setSelectedModel(newModel);
        }
    }, [modelName, modelDescription, categoryUrl]);

    useEffect(() => {
        if (versionNumber !== "") {
            const newVersion: SoftwareVersion = {
                label: [createVersionLabel(selectedModel, versionNumber)],
                description: [`Version ${versionNumber}`],
            };
            setSelectedVersion(newVersion);
        }
    }, [versionNumber]);

    const formValid = () => {
        return selectedModel && selectedVersion && modelUrl && versionUrl && username;
    };

    const buttonDisabled = () => {
        return !formValid() || saving;
    };

    function handleSubmit(event: React.FormEvent<EventTarget>) {
        const update = async () => {
            setSaving(true);
            if (formValid() && cfg && selectedModel && selectedVersion && username) {
                const modelConfigurationRequest = { ...props.modelConfiguration, hasModelCategory: [{ id: categoryUrl }] };
                const modelConfiguration = await saveConfiguration(modelConfigurationRequest, cfg, username);
                const softwareVersion = await saveVersion(modelConfiguration, cfg, username, selectedModel, selectedVersion);
                if (softwareVersion) {
                    const model = await saveModel(softwareVersion, selectedModel, cfg, username);
                    if (model && model.id && modelConfiguration && modelConfiguration.id && softwareVersion && softwareVersion.id) {
                        const url =
                            mintUiUrl +
                            `/any/models/explore/` +
                            getIdFromUrl(model.id) +
                            `/` +
                            getIdFromUrl(softwareVersion.id) +
                            `/` +
                            getIdFromUrl(modelConfiguration.id);
                        setModelConfigurationUrl(url);
                        setSaving(false);
                        setSaved(true);
                    } else {
                        setError("Error saving model");
                        setSaving(false);
                    }
                } else {
                    setError("Error saving version");
                    setSaving(false);
                }
            } else {
                setError("Error saving configuration");
                setSaving(false);
            }
        };
        event.preventDefault();
        update();
    }

    function handleCategoryChange(event: SelectChangeEvent<String>) {
        /**
         * Handle selection of categories.
         */
        let catId: string = event.target.value as string;
        setSelectedModel(undefined);
        setSelectedVersion(undefined);
        setCategoryUrl(catId);
        if (isUrl(catId)) {
            // Filter models by category url
            setPossibleModels(models.filter((m: Model) => m.hasModelCategory && m.hasModelCategory.some((cat: ModelCategory) => cat.id === catId)));
        } else {
            setPossibleModels(models);
        }
    }

    function handleVersionChange(event: SelectChangeEvent<String>) {
        let versionId: string = event.target.value as string;

        setVersionUrl(versionId);
        if (isUrl(versionId)) {
            let version: SoftwareVersion = possibleVersions.filter((v: SoftwareVersion) => v.id === versionId)[0];
            setSelectedVersion(version);
        }
    }

    function handleModelChange(event: SelectChangeEvent<String>) {
        /**
         * Handle selection of model
         */
        let modelId: string = event.target.value as string;
        setModelUrl(modelId);
        if (isUrl(modelId)) {
            let model: Model = models.filter((m: Model) => m.id === modelId)[0];
            setPossibleVersions(versions.filter((v: SoftwareVersion) => (model.hasVersion || []).some((v2) => v2.id === v.id)));
            setSelectedModel(model);
        } else {
            setSelectedModel(undefined);
        }
    }

    // === Selector and option helpers
    function renderOption(m: Model | SoftwareVersion | ModelCategory) {
        return <MenuItem value={m.id}>{m.label ? m.label[0] : "no-label"}</MenuItem>;
    }

    function createVersionDescription(model: Model | undefined, number: string) {
        if (model && model.label && model.label.length > 0) {
            return "Version " + number + " for " + model.label[0];
        }
        return number;
    }

    function createVersionLabel(model: Model | undefined, number: string) {
        if (model && model.label && model.label.length > 0) {
            let label: string = model.label[0];
            let re: RegExp = /\(.*?\)/;
            if (label.includes(":")) {
                let sp: string[] = label.split(":");
                return sp[0] + " version " + number;
            } else if (re.test(label)) {
                let matches: RegExpExecArray | null = re.exec(label);
                if (matches && matches.length > 0) {
                    return matches[0] + " version " + number;
                }
            }
            return label + " version " + number;
        }
        return number;
    }

    function modelCategorySelector() {
        /**
         * Create selector of model categories
         */
        return (
            <div>
                <InputLabel id="category-select-label">Select a model category:</InputLabel>
                <Select fullWidth labelId="category-select-label" value={categoryUrl} placeholder="Select a category..." onChange={handleCategoryChange}>
                    <MenuItem value="-"> None </MenuItem>
                    {!loading && categories.length > 0 && categories.map(renderOption)}
                </Select>
                {/* <FormHelperText style={{margin: "0px 14px"}}>{errCategory}</FormHelperText> */}
            </div>
        );
    }

    function modelSelector() {
        /**
         * Create selector of models
         */
        let showAll: boolean = categoryUrl === "" || categoryUrl === "-";
        let categorizedModels: { [catLabel: string]: Model[] } = {};
        if (showAll) {
            categories.forEach((cat: ModelCategory) => {
                let catLabel: string = cat.label && cat.label.length > 0 ? cat.label[0] : "Uncategorized";
                let ms: Model[] = models.filter((m: Model) => (m.hasModelCategory || []).some((c2: ModelCategory) => c2.id === cat.id));
                if (ms.length > 0) categorizedModels[catLabel] = ms;
            });
            let noCategory: Model[] = models.filter((m: Model) => !m.hasModelCategory || m.hasModelCategory.length === 0);
            if (noCategory.length > 0) {
                categorizedModels["Uncategorized"] = noCategory;
            }
        }

        return (
            <div>
                <InputLabel id="model-select-label">Select a model:</InputLabel>
                <Select fullWidth labelId="model-select-label" id="model-select" value={modelUrl} placeholder="Select a model..." onChange={handleModelChange}>
                    <MenuItem value="create_new">- Create new Model -</MenuItem>
                    {showAll
                        ? Object.keys(categorizedModels).map((catName: string) => [
                              <ListSubheader>{catName}</ListSubheader>,
                              ...categorizedModels[catName].map(renderOption),
                          ])
                        : possibleModels.map(renderOption)}
                </Select>
            </div>
        );
    }

    function versionSelector() {
        /**
         * Create selector of model versions
         */
        return (
            <div>
                <InputLabel id="version-select-label">Select a model version:</InputLabel>
                <Select fullWidth labelId="version-select-label" id="version-select" value={versionUrl} onChange={handleVersionChange}>
                    <MenuItem value="create_new">- Create new Version -</MenuItem>
                    {possibleVersions.map(renderOption)}
                </Select>
            </div>
        );
    }

    function renderEditMode() {
        /**
         * Render Edit Mode
         */
        return (
            <div>
                <Typography variant="h6" color="inherit">
                    Select a model
                </Typography>

                <Typography variant="body1" color="inherit">
                    Choose an existing model or create a new one
                </Typography>

                <Typography variant="body2" color="inherit">
                    Information obtained from:
                    <Link underline="hover" href={mintUiUrl}>
                        MINT Model Catalog
                    </Link>
                </Typography>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    {loading || saving ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <CircularProgress />
                            {saving && (
                                <Typography variant="body2" color="inherit">
                                    Saving your information
                                </Typography>
                            )}
                            {loading && (
                                <Typography variant="body2" color="inherit">
                                    Loading information from Model Catalog {REACT_APP_MODEL_CATALOG_API}{" "}
                                </Typography>
                            )}
                        </div>
                    ) : (
                        <Box sx={{ marginBottom: "10px" }}>
                            {modelCategorySelector()}
                            {modelSelector()}

                            {/* Handle create new model */}
                            {modelUrl === "create_new" && (
                                <Box>
                                    <TextField
                                        style={{ margin: "5px 2px" }}
                                        fullWidth
                                        label="New model name"
                                        onChange={(event) => setModelName(event.target.value)}
                                        value={modelName}
                                    />
                                    <TextareaAutosize
                                        style={{ margin: "5px 2px", width: "100%" }}
                                        aria-label="Model description"
                                        placeholder="Enter a short model description"
                                        onChange={(event) => setModelDescription(event.target.value)}
                                        minRows={3}
                                        value={modelDescription}
                                    />
                                </Box>
                            )}

                            {selectedModel !== undefined && versionSelector()}
                            {selectedModel !== undefined && (possibleVersions.length === 0 || versionUrl === "create_new") && (
                                <TextField
                                    style={{ margin: "5px 2px" }}
                                    fullWidth
                                    label="New model version"
                                    placeholder="v1.0.0"
                                    onChange={(event) => setVersionNumber(event.target.value)}
                                    value={versionNumber}
                                />
                            )}
                        </Box>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="submit" disabled={buttonDisabled()} variant="contained">
                            Set
                        </Button>
                    </Box>
                </form>
            </div>
        );
    }

    //Model catalog API related
    // return renderEditMode()
    return saved ? (
        error ? (
            <div>
                <Typography variant="h6" color="inherit">
                    Error
                </Typography>
                <Typography variant="body1" color="inherit">
                    {error}
                </Typography>
            </div>
        ) : (
            <div>
                <Typography variant="h6" color="inherit">
                    Saved
                    <Typography variant="body2" color="inherit">
                        To change the model, go to the{" "}
                        <Link underline="hover" href={modelConfigurationUrl}>
                            MINT Model Catalog
                        </Link>
                    </Typography>
                </Typography>
            </div>
        )
    ) : (
        renderEditMode()
    );
};

export default ModelSelector;
