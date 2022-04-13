import React, { useEffect, useState } from "react";
import { IPYTHON_API, MAT_API } from "../environment";
import { CommandLineObject } from "../../models/cwl/cwl";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, Typography } from "@mui/material";

type NotebooksParams = {
  taskId: string;
  modelId: string;
  versionId: string;
  dockerImage: string;
};

type NotebookStatus = {
  name: string;
  checked: boolean;
  spec: string;
};

const Notebooks = (props: NotebooksParams) => {
  const [notebooks, setNotebooks] = useState<NotebookStatus[] | undefined>(
    undefined
  );

  return (
    <div> p </div>
    // <div>
    //   <Typography variant="h5" color="inherit">
    //     Select a notebook.
    //   </Typography>
    //   {loading && (
    //     <Box sx={{ display: "flex" }}>
    //       <CircularProgress />
    //     </Box>
    //   )}

    //   {notebooks && notebooks.length > 0 ? (
    //     <form onSubmit={formSubmit}>
    //       <Typography variant="body1" color="inherit">
    //         We found the following notebooks. Please, select one to create a
    //         Model Configuration
    //       </Typography>
    //       {notebooks.map((n) => (
    //         <div key={n.name} className="radio">
    //           <label>
    //             <input
    //               type="radio"
    //               value={n.name}
    //               onChange={onValueChange}
    //               checked={option === n.name}
    //             />
    //             {n.name}
    //             {stringify(n.spec)}
    //           </label>
    //         </div>
    //       ))}
    //       <button className="btn btn-default" type="submit">
    //         Submit
    //       </button>
    //     </form>
    //   ) : (
    //     <p>No notebooks available</p>
    //   )}
    // </div>
  );
};

export default Notebooks;
