import { useEffect, useState } from "react";
import { Model } from "../types/mat";
import { MAT_API } from "./environment";
import { Link } from "react-router-dom";

const ModelList = () => {
  const [models, setModels] = useState<Model[]>();

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
      {models?.map((model: Model) => (
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
