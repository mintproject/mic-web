import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { IPYTHON_API, MAT_API } from "./environment";
import { parse, stringify } from "yaml";
import { Model, Parameter, Input, createParameters, createInputs } from "../types/mat";
import { CommandLineObject } from "../types/cwl";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}


function getParametersCwl(data: CommandLineObject) : Parameter[]{
      return Object.entries(data.inputs)
        .map(([key, value], index ) => {
          if (value?.type !== "File") {
            return {name: key, prefix: value?.inputBinding.prefix, type: value?.type}
          }
        }
        ).filter(notEmpty)
}


function getFilesCwl(data: CommandLineObject) : Input[]{
      return Object.entries(data.inputs)
        .map(([key, value], index ) => {
          if (value?.type === "File") {
            return {name: key, display_name: key, prefix: value?.inputBinding.prefix}
          }
        }
        ).filter(notEmpty)
}

type NotebooksParams = {
  taskId: string;
};

type NotebookStatus = {
  name: string;
  checked: boolean;
  spec: string;
};

const Notebooks = (props: NotebooksParams | {}) => {
  const [notebooks, setNotebooks] = useState<NotebookStatus[] | undefined>(
    undefined
  );
  const { taskId } = useParams<NotebooksParams>();
  const [option, setOption] = useState<string | undefined>(undefined);
  const [ triggerRedirect, setTriggerRedirect ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modelId, setModelId] = useState('');

  async function setCwlSpec(taskId: string, fileName: string | undefined) {
    if (typeof fileName === "undefined") {
      console.error("filename cannot be undefined");
    } else {
      return fetch(
        `${IPYTHON_API}/specs/${taskId}?spec_file_name=${encodeURIComponent(
          fileName
        )}`
      )
        .then((response) => response.text())
        .then((spec) => {
          const parsed_spec : CommandLineObject = parse(spec)
          const model : Model = {
            name: option ? option : "",
            description: "test",
            type: "cwl",
            cwl_spec: parsed_spec,
            //inputs: getFilesCwl(parsed_spec),
            //parameters: getParametersCwl(parsed_spec),
            docker_image: parsed_spec.hints.DockerRequirement.dockerImageId
          }
          return model
        });
    }
  }

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOption(event.target.value);
  }

  function formSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    setCwlSpec(taskId, option).then((model) => {
      const url = `${MAT_API}/models`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      })
        .then((response) => response.json())
        .then((model: Model) => {
            createParameters(model.id as string, getParametersCwl(model.cwl_spec))
            createInputs(model.id as string, getFilesCwl(model.cwl_spec))
            setModelId(model.id as string)
            setTriggerRedirect(true)
            
        })

    });
  }
  useEffect(() => {
    fetch(`${IPYTHON_API}/tasks/${taskId}/specs`)
      .then((response) => response.json())
      .then((data) => {
        setNotebooks(
          data.map((d: string) => {
            return { name: d, checked: false };
          })
        );
        setLoading(false);
      });
  }, []);

  return (
    <div className="selection_notebook">
      {modelId !== '' && <Redirect to={`/models/${modelId}/summary`}/> }
      {loading ? <h2> Loading your notebooks </h2> : <h2>Select the notebooks</h2>}
      <form onSubmit={formSubmit}>
        {notebooks?.map((n) => (
          <div key={n.name} className="radio">
            <label>
              <input
                type="radio"
                value={n.name}
                onChange={onValueChange}
                checked={option === n.name}
              />
              {n.name}
              {stringify(n.spec)}
            </label>
          </div>
        ))}
        <button className="btn btn-default" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Notebooks;
