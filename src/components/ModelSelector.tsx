import {
  Button,
  Container,
  Paper,
  Typography,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  Model,
  SoftwareVersion,
  ModelCategory,
  //ModelConfiguration,
} from "@mintproject/modelcatalog_client";
import { Context } from "../contexts/ModelCatalog";
import Box from "@mui/material/Box";
import isUrl from "validator/lib/isURL";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const ModelSelector = () => {
  const {
    models,
    versions,
    categories,
    loadingMC,
    selectedModel,
    selectedVersion,
    setSelectedModel,
    setSelectedVersion,
  } = useContext(Context);
  const [editMode, setEditMode] = useState(true);
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("-");
  const [possibleModels, setPossibleModels] = useState([] as Model[]);
  const [possibleVersions, setPossibleVersions] = useState(
    [] as SoftwareVersion[]
  );

  const [modelUrl, setModelUrl] = useState("");
  const [versionUrl, setVersionUrl] = useState("");

  // handle events

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    /**
     * Handle save button event
     */
    event.preventDefault();
    setSelectedModel(undefined);
    setSelectedVersion(undefined);
    let sModel: Model | undefined = undefined;
    if (isUrl(modelUrl)) {
      // Model exists, just assign it.
      let model: Model = models.filter((m: Model) => m.id === modelUrl)[0];
      setSelectedModel(model);
      sModel = model;
    } else if (modelUrl === "create_new") {
      // The model does not exists, create a new model without ID
      if (!modelName || !modelDescription || !isUrl(categoryUrl)) {
        //FIXME: show errors!
        return;
      } else {
        let newModel: Model = {
          label: [modelName],
          description: [modelDescription],
          hasModelCategory: [{ id: categoryUrl }],
        };
        setSelectedModel(newModel);
        sModel = newModel;
      }
    } else console.warn("unhandled else 1");

    if (isUrl(versionUrl)) {
      let version: SoftwareVersion = versions.filter(
        (v: SoftwareVersion) => v.id === versionUrl
      )[0];
      setSelectedVersion(version);
    } else if (versionUrl === "create_new") {
      if (!versionNumber) {
        //FIXME: show error
        return;
      } else {
        let newVersion: SoftwareVersion = {
          label: [createVersionLabel(sModel, versionNumber)],
          description: [createVersionDescription(sModel, versionNumber)],
          hasVersionId: [versionNumber],
        };
        setSelectedVersion(newVersion);
      }
    } else console.warn("unhandled else 2");

    setEditMode(false);
  }

  function handleCategoryChange(event: SelectChangeEvent<String>) {
    /**
     * Handle selection of categories.
     */
    let catId: string = event.target.value as string;
    setCategoryUrl(catId);
    if (isUrl(catId)) {
      // Filter models by category url
      setPossibleModels(
        models.filter(
          (m: Model) =>
            m.hasModelCategory &&
            m.hasModelCategory.some((cat: ModelCategory) => cat.id === catId)
        )
      );
    } else {
      setPossibleModels(models);
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
      setPossibleVersions(
        versions.filter((v: SoftwareVersion) =>
          (model.hasVersion || []).some((v2) => v2.id === v.id)
        )
      );
    }
    if (possibleVersions.length === 0 || modelId === "create_new") {
      setVersionUrl("create_new");
    }
  }

  // === Selector and option helpers
  function renderOption(m: Model | SoftwareVersion | ModelCategory) {
    return (
      <MenuItem value={m.id}>{m.label ? m.label[0] : "no-label"}</MenuItem>
    );
  }

  function createVersionDescription (model:Model| undefined, number:string) {
    if (model && model.label && model.label.length > 0) {
      return "Version " + number + " for " + model.label[0];
    }
    return number;
  }

  function createVersionLabel (model:Model| undefined, number:string) {
    if (model && model.label && model.label.length > 0) {
      let label:string = model.label[0];
      let re : RegExp = /\(.*?\)/;
      if (label.includes(":")) {
        let sp : string[] = label.split(":");
        return sp[0] + " version " + number;
      } else if (re.test(label)) {
        let matches : RegExpExecArray | null = re.exec(label);
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
        <InputLabel id="category-select-label">
          Select a model category:
        </InputLabel>
        <Select
          fullWidth
          labelId="category-select-label"
          value={categoryUrl}
          placeholder="Select a category..."
          onChange={handleCategoryChange}
        >
          <MenuItem value="-"> None </MenuItem>
          {!loadingMC && categories.length > 0 && categories.map(renderOption)}
        </Select>
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
        let catLabel: string =
          cat.label && cat.label.length > 0 ? cat.label[0] : "Uncategorized";
        let ms: Model[] = models.filter((m: Model) =>
          (m.hasModelCategory || []).some(
            (c2: ModelCategory) => c2.id === cat.id
          )
        );
        if (ms.length > 0) categorizedModels[catLabel] = ms;
      });
      let noCategory: Model[] = models.filter(
        (m: Model) => !m.hasModelCategory || m.hasModelCategory.length === 0
      );
      if (noCategory.length > 0) {
        categorizedModels["Uncategorized"] = noCategory;
      }
    }

    return (
      <div>
        <InputLabel id="model-select-label">Select a model:</InputLabel>
        <Select
          fullWidth
          labelId="model-select-label"
          id="model-select"
          value={modelUrl}
          placeholder="Select a model..."
          onChange={handleModelChange}
        >
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
        <InputLabel id="version-select-label">
          Select a model version:
        </InputLabel>
        <Select
          fullWidth
          labelId="version-select-label"
          id="version-select"
          value={versionUrl}
          onChange={(event) => setVersionUrl(event.target.value as string)}
        >
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

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          {loadingMC ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
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
                    onChange={(event) =>
                      setModelDescription(event.target.value)
                    }
                    minRows={3}
                    value={modelDescription}
                  />
                </Box>
              )}

              {isUrl(modelUrl) &&
                possibleVersions.length > 0 &&
                versionSelector()}

              {versionUrl === "create_new" && (
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
            <Button
              type="submit"
              disabled={ loadingMC || modelUrl === ""}
              variant="contained"
              onClick={enableEditMode}
            >
              Set
            </Button>
          </Box>
        </form>
      </div>
    );
  }

  function enableEditMode() {
    if (selectedModel) {
      if (selectedModel.label && selectedModel.label.length > 0)
        setModelName(selectedModel.label[0]);
      if (selectedModel.description && selectedModel.description.length > 0)
        setModelDescription(selectedModel.description[0]);
      if (
        selectedModel.hasModelCategory &&
        selectedModel.hasModelCategory.length > 0 &&
        selectedModel.hasModelCategory[0].id
      )
        setCategoryUrl(selectedModel.hasModelCategory[0].id);
    }
    if (selectedVersion) {
      if (
        selectedVersion.hasVersionId &&
        selectedVersion.hasVersionId.length > 0
      )
        setVersionNumber(selectedVersion.hasVersionId[0]);
    }
    setEditMode(true);
  }

  function renderViewMode() {
    return (
      <div>
        <Typography variant="body1" color="inherit">
          Selected model:
        </Typography>

        {selectedModel != null && selectedVersion != null ? (
          [
            <Typography variant="h6" color="inherit">
              {selectedModel.label && selectedModel.label.length > 0
                ? selectedModel.label[0]
                : "no-label"}
            </Typography>,
            <i style={{ color: "#888" }}>
              {selectedModel.description && selectedModel.description.length > 0
                ? selectedModel.description[0]
                : "no-description"}
            </i>,
            <Typography variant="body1" color="inherit">
              Selected version:{" "}
              {selectedVersion.hasVersionId &&
              selectedVersion.hasVersionId.length > 0
                ? selectedVersion.hasVersionId[0]
                : "no-vid"}
            </Typography>,
          ]
        ) : (
          <Typography variant="body1" color="inherit">
            An error has ocurred
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            disabled={loadingMC}
            variant="contained"
            onClick={enableEditMode}
          >
            Edit
          </Button>
        </Box>
      </div>
    );
  }

  //Model catalog API related
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {editMode ? renderEditMode() : renderViewMode()}
      </Paper>
    </Container>
  );
};

export default ModelSelector;
