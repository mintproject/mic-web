import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { COMPONENTS_URL, REPOSITORY_URL } from "../../constants/routes";
import { createComponent } from "../../services/api/Component";

export const FormComponentNew = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [gitUrl, setGitUrl] = React.useState("");
  const isValid = name && description;
  const [error, setError] = React.useState("");
  const history = useHistory();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      const data = await createComponent({
        name: name,
        description: description,
      }, gitUrl);
      const { id, gitRepo } = data;
      if (id && gitRepo && gitRepo.url) {
        history.push(`${COMPONENTS_URL}/${id}/analyze`);
      } else if (id) {
        history.push(`${COMPONENTS_URL}/${id}/commandLine`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Typography variant="h4">Create a new component</Typography>
      <form onSubmit={handleSubmit}>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          fullWidth
          aria-label="Name of the component"
          id="display"
          placeholder="Name"
          label="Name"
          helperText="Name of the component: e.g. 'Implementation of MODFLOW model using R package and calibrated for the Texas Region' "
          name="name"
          value={name}
          variant="outlined"
          margin="normal"
          onChange={(event) => setName(event.target.value)}
        />

        <TextField
          fullWidth
          aria-label="Description of the component"
          id="description"
          placeholder="Description"
          name="description"
          value={description}
          variant="outlined"
          margin="normal"
          onChange={(event) => setDescription(event.target.value)}
          helperText="Description of the component: e.g. '' "
        />

        <TextField
          fullWidth
          aria-label="Git repository url"
          id="gitRepo"
          placeholder="Git repository url"
          name="gitRepo"
          value={gitUrl}
          variant="outlined"
          margin="normal"
          onChange={(event) => setGitUrl(event.target.value)}
          helperText="Git repository url: If your code is available on a Git repository, you can extract metadata and notebook from your repository"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!isValid}
        >
          {" "}
          Save{" "}
        </Button>
      </form>
    </div>
  );
};
