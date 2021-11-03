import { Button, Container, Paper, Typography, InputLabel, Select, SelectChangeEvent, MenuItem, TextareaAutosize, CircularProgress, ListSubheader} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import isUrl from "validator/lib/isURL";

import { Model, SoftwareVersion, ModelApi, SoftwareVersionApi, Configuration, ModelCategory, ModelCategoryApi, ModelConfiguration, ModelConfigurationApi } from "@mintproject/modelcatalog_client";

const ModelSelector = () => {
  //Model catalog API related
  const [loadingMC, setLoadingMC] = useState(true);
  const [MCUser, setMCUser] = useState("mint@isi.edu");
  const [allModels, setAllModels] = useState([] as Model[]);
  const [allVersions, setAllVersions] = useState([] as SoftwareVersion[]);
  const [allCategories, setAllCategories] = useState([] as ModelCategory[]);

  // Where to store the filtered models and versions
  const [possibleModels, setPossibleModels] = useState([] as Model[]);
  const [possibleVersions, setPossibleVersions] = useState([] as SoftwareVersion[]);

  // State
  const [editMode, setEditMode] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [versionUrl, setVersionUrl] = useState("");
  const [categoryUrl, setCategoryUrl] = useState("-");


  // Forms for new models and version
  const [modelName, setModelName] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model|null>(null);
  const [selectedVersion, setSelectedVersion] = useState<SoftwareVersion|null>(null);

  // Errors 
  const [errors, setErrors] = useState<string | undefined>(undefined);

  // Load data from the model catalog
  useEffect(() => {
    //FIXME add correct dependencies to use effect
    if (allModels.length + allVersions.length === 0) {
      setLoadingMC(true);
      // Set the configuration fo the model catalog. FIXME
      let cfg : Configuration = new Configuration({
        basePath: "https://api.models.dev.mint.isi.edu/v1.8.0",
        //accessToken: TOKEN
      });

      // Create APIs and get data
      let mApi = new ModelApi(cfg);
      let cApi = new ModelCategoryApi(cfg);
      let vApi = new SoftwareVersionApi(cfg);

      let pModels : Promise<Model[]> = mApi.modelsGet({username: MCUser});
      let pCategory : Promise<ModelCategory[]> = cApi.modelcategorysGet({username: MCUser});
      let pVersions : Promise<SoftwareVersion[]> = vApi.softwareversionsGet({username: MCUser});

      pModels.then((models:Model[]) => {
        setAllModels(models);
        setPossibleModels(models);
      });
      pCategory.then(setAllCategories);
      pVersions.then(setAllVersions);

      Promise.all([pModels, pVersions, pCategory])
        .then(()=> {
          setLoadingMC(false);
        })
        .catch((error) => {
          console.warn(error);
          setModelUrl("create_new")
        })
    }
  });

  function handleCategoryChange(event: SelectChangeEvent<String>) {
    let catId : string = event.target.value as string;
    setCategoryUrl(catId);
    if (isUrl(catId)) {
      // Filter models by category url
      setPossibleModels(
        allModels.filter((m:Model) => m.hasModelCategory && m.hasModelCategory.some((cat:ModelCategory) => cat.id === catId))
      );
    } else {
      setPossibleModels(allModels);
    }
  }

  function handleModelChange(event: SelectChangeEvent<String>) {
    let modelId : string = event.target.value as string;
    setModelUrl(modelId);
    if (isUrl(modelId)) {
      let model : Model = allModels.filter((m:Model) => m.id === modelId)[0];
      setPossibleVersions(allVersions.filter((v:SoftwareVersion) => (model.hasVersion||[]).some((v2) => (v2.id === v.id))));
    }
    if (possibleVersions.length === 0 || modelId === "create_new") {
      setVersionUrl("create_new");
    }
  }

  function handleVersionChange(event: SelectChangeEvent<String>) {
    setVersionUrl(event.target.value as string);
  }

  function handleModelNameChange (event: React.ChangeEvent<HTMLInputElement>) {
    setModelName(event.target.value);
  }

  function handleModelDescriptionChange (event: React.ChangeEvent<HTMLTextAreaElement>) {
    setModelDescription(event.target.value);
  }

  function handleVersionNumberChange (event: React.ChangeEvent<HTMLInputElement>) {
    setVersionNumber(event.target.value);
  }

  function enableEditMode () {
    if (selectedModel) {
      if (selectedModel.label && selectedModel.label.length>0)
        setModelName(selectedModel.label[0]);
      if (selectedModel.description && selectedModel.description.length>0)
        setModelDescription(selectedModel.description[0]);
      if (selectedModel.hasModelCategory && selectedModel.hasModelCategory.length>0 && selectedModel.hasModelCategory[0].id)
        setCategoryUrl(selectedModel.hasModelCategory[0].id);
    }
    if (selectedVersion) {
      if (selectedVersion.hasVersionId && selectedVersion.hasVersionId.length > 0)
        setVersionNumber(selectedVersion.hasVersionId[0]);
    }

    setSelectedModel(null);
    setSelectedVersion(null);
    setEditMode(true);
  }

  // === Selector and option helpers
  function renderOption (m:Model|SoftwareVersion|ModelCategory) {
    return (
      <MenuItem value={m.id}>{m.label ? m.label[0] : "no-label"}</MenuItem>
    );
  }

  function modelCategorySelector () {
    return (
      <div>
        <InputLabel id="category-select-label">Select a model category:</InputLabel>
        <Select
          fullWidth
          labelId="category-select-label"
          value={categoryUrl}
          placeholder="Select a category..."
          onChange={handleCategoryChange}
        >
          <MenuItem value="-"> None </MenuItem>
          {!loadingMC && allCategories.length > 0 && (allCategories.map(renderOption))
          }
        </Select>
      </div>
    );
  }

  function modelSelector () {
    let showAll : boolean = categoryUrl === "" || categoryUrl === "-";
    let categorizedModels : {[catLabel:string]: Model[]} = {};
    if (showAll) {
      allCategories.forEach((cat:ModelCategory) => {
        let catLabel : string = cat.label && cat.label.length > 0 ? cat.label[0] : "Uncategorized";
        let ms : Model[] = allModels.filter((m:Model) => (m.hasModelCategory||[]).some((c2:ModelCategory) =>
            c2.id === cat.id
        ));
        if (ms.length > 0) categorizedModels[catLabel] = ms;
      })
      let noCategory : Model[] = allModels.filter((m:Model) => (!m.hasModelCategory || m.hasModelCategory.length === 0));
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
          {(showAll)? (
            Object.keys(categorizedModels).map((catName:string) => [
                <ListSubheader>{catName}</ListSubheader>,
                ...categorizedModels[catName].map(renderOption)
            ])
          ) : (
            possibleModels.map(renderOption)
          )}
        </Select>
      </div>
    );
  }

  function versionSelector () {
    return (
      <div>
        <InputLabel id="version-select-label">Select a model version:</InputLabel>
        <Select
          fullWidth
          labelId="version-select-label"
          id="version-select"
          value={versionUrl}
          onChange={handleVersionChange}
        >
          <MenuItem value="create_new">- Create new Version -</MenuItem>
          {possibleVersions.map(renderOption)}
        </Select>
      </div>
    );
  }

  // === RENDER MAIN VIEWS === //

  function renderEditMode () {
    return (
      <div>
        <Typography variant='h6' color='inherit'>
            Select a model
        </Typography>

        <Typography variant='body1' color='inherit'>
            Choose an existing model or create a new one
        </Typography>

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          {loadingMC ? (
            <div style={{display: "flex", justifyContent: "center"}}>
              <CircularProgress/>
            </div>
          ) : (
          <Box sx={{marginBottom: "10px"}}>
            {modelCategorySelector()}
            {modelSelector()}

            {modelUrl==="create_new" && (
              <Box>
                <TextField
                  style={{margin: "5px 2px"}}
                  fullWidth
                  label="New model name"
                  onChange={handleModelNameChange}
                  value={modelName}
                />
                <TextareaAutosize
                  style={{margin: "5px 2px", width: "100%"}}
                  aria-label="Model description"
                  placeholder="Enter a short model description"
                  onChange={handleModelDescriptionChange}
                  minRows={3}
                  value={modelDescription}
                />
              </Box>
            )}

            {isUrl(modelUrl) && (possibleVersions.length > 0 && versionSelector())}

            {versionUrl === "create_new" && (
                <TextField
                  style={{margin: "5px 2px"}}
                  fullWidth
                  label="New model version"
                  placeholder="v1.0.0"
                  onChange={handleVersionNumberChange}
                  value={versionNumber}
                />
            )}
          </Box>
          )}
          
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              disabled={creating || loadingMC || modelUrl===""}
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

  function renderViewMode () {
    return (
      <div>
        <Typography variant='body1' color='inherit'>
            Selected model:
        </Typography>

        {(selectedModel != null && selectedVersion != null) ? [
          <Typography variant='h6' color='inherit'>
            {selectedModel.label && selectedModel.label.length > 0 ? selectedModel.label[0] : "no-label"}
          </Typography>,
          <i style={{color: '#888'}}>
            {selectedModel.description && selectedModel.description.length > 0 ? selectedModel.description[0] : "no-description"}
          </i>,
          <Typography variant='body1' color='inherit'>
            Selected version: {selectedVersion.hasVersionId && selectedVersion.hasVersionId.length > 0 ? selectedVersion.hasVersionId[0] : "no-vid"}
          </Typography>,
        ]:(
          <Typography variant='body1' color='inherit'>
            An error has ocurred
          </Typography>
        )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              disabled={creating || loadingMC}
              variant="contained"
              onClick={enableEditMode}
            >
              Edit
            </Button>
          </Box>
      </div>
    );
  }

  // Handle submit and save
  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();

    setSelectedModel(null);
    setSelectedVersion(null);

    let sModel : Model|null = null;

    if (isUrl(modelUrl)) {
      // Model exists, just assign it.
      let model : Model = allModels.filter((m:Model) => m.id === modelUrl)[0];
      setSelectedModel(model);
      sModel = model;
    } else if (modelUrl === "create_new") {
      // The model does not exists, create a new model without ID
      if (!modelName || !modelDescription || !isUrl(categoryUrl)) {
        //FIXME: show errors!
        return;
      } else {
        let newModel : Model = {
          label: [modelName],
          description: [modelDescription],
          hasModelCategory: [{id: categoryUrl}]
        }
        setSelectedModel(newModel);
        sModel = newModel;
      }
    } else console.warn("unhandled else 1");

    if (isUrl(versionUrl)) {
      let version : SoftwareVersion = allVersions.filter((v:SoftwareVersion) => v.id === versionUrl)[0];
      setSelectedVersion(version);
    } else if (versionUrl === "create_new") {
      if (!versionNumber) {
        //FIXME: show error
        return;
      } else {
        let newVersion : SoftwareVersion = {
          label: [createVersionLabel(sModel, versionNumber)],
          description: [createVersionDescription(sModel, versionNumber)],
          hasVersionId: [versionNumber],
        };
        setSelectedVersion(newVersion);
      }
    } else console.warn("unhandled else 2");

    setEditMode(false);
  }

  function createVersionLabel (model:Model|null, number:string) {
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

  function createVersionDescription (model:Model|null, number:string) {
    if (model && model.label && model.label.length > 0) {
      return "Version " + number + " for " + model.label[0];
    }
    return number;
  }

  function saveConfiguration (cfg:ModelConfiguration) : Promise<ModelConfiguration> {
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
        });
      }
    });
    returnVal.finally(() => setCreating(false));
    return returnVal;
  }

  // Entry point 
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