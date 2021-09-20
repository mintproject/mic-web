import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOption(event.target.value);
  }

  function formSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    console.log(option);
  }
  useEffect(() => {
    fetch(`http://localhost:8004/tasks/${taskId}/specs`)
      .then((response) => response.json())
      .then((data) => {
        setNotebooks(data.map((d: string) => {
            return {name: d, checked: false }
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
