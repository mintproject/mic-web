import { useEffect, useState } from "react";
import { MAT_API } from "./environment";
import { Link } from "react-router-dom";
import { Component } from '../models/Component';


const ModelList = () => {
  const [models, setModels] = useState<Component[]>();

  useEffect(() => {
    const getModels = async () => {
      try {
        const response = await fetch(`${MAT_API}/models`);
        const data = await response.json();
        setModels(data);
      } catch (error) {
        //todo: handle error
        console.log(error);
      }
    };
    getModels();
  }, []);
  console.log(models);

  return (
    <div className="ModelList">
      {models?.map((model: Component) => (
        <p>
          <Link key={model.id} to={`/models/${model.id}/summary`}>
            {model.name}
          </Link>
        </p>
      ))}
    </div>
  );
};
export default ModelList;
