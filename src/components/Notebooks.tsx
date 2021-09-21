import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPYTHON_API, MAT_API } from "./environment";
import {parse, stringify} from 'yaml';
import {Model} from '../types/cwl'

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
  
   async function setCwlSpec(taskId: string, fileName: string | undefined){
      if (typeof fileName === "undefined"){
        console.error('filename cannot be undefined')
      }
      else {
      return await fetch(`${IPYTHON_API}/specs/${taskId}?spec_file_name=${encodeURIComponent(fileName)}`)
          .then((response) => response.text())
          .then((spec) => (parse(spec)))
      }
  }

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOption(event.target.value);
  }

  function formSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    setCwlSpec(taskId, option)
      .then(data => {
        console.log(data)
          const model : Model = {
            name: option? option : "",
            description: "description",
            type: "cwl",
            cwl_spec: data
          }
          const url = `${MAT_API}/models`
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(model)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
      })
  }
  useEffect(() => {
    fetch(`${IPYTHON_API}/tasks/${taskId}/specs`)
      .then((response) => response.json())
      .then((data) => {
        setNotebooks(data.map((d: string) => {
            return {name: d, checked: false}
        }));
      });
  }, []);

  return (
    <div className="selection_notebook">
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
