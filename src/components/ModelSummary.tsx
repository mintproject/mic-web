import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Model } from "../types/mat";
import { MAT_API } from "./environment";

type ModelParameter = {
  modelId: string;
};

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

const ModelSummary = () => {
  const { modelId } = useParams<ModelParameter>();
  const [model, setModel] = useState<Model>();
  const [loading, setLoading] = useState<Boolean>(true);
  //const [inputData, setInputData] = useState();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    console.log(name);
    console.log(value);
  }

  function handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
  }

  useEffect(() => {
    fetch(`${MAT_API}/models?filter[where][id]=${modelId}&filter[include][]=inputs&filter[include][]=parameters`)
      .then((response) => handleErrors(response))
      .then((response) => response.json())
      .then((data) => {
        setModel(data[0]);
        setLoading(false);
      })
      .catch((error) => <Redirect to="/404" />);
  }, []);
  if (loading){
      return (<p>Loading</p>)
  }
  else {

  return (

     <div className="selection_notebook">
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Model Name"
              name="name"
              value={model?.name}
              onChange={handleChange}
            />
            <br/ >
            <input
              placeholder="Display Name"
              name="displayName"
              value={model?.display_name}
              onChange={handleChange}
            />
            <br />
            <input
              placeholder="Description"
              name="description"
              value={model?.display_name}
              onChange={handleChange}
            />
            <br />
          
            <h3> Inputs </h3>
            <ul>
                {model?.inputs?.map((input) => (
                    <li key={input.id}> {input.name} </li>
                ))}
            </ul>
          </form>
        </div>

  );
                }
};

export default ModelSummary;
