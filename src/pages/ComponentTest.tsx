import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Component } from "../models/Component";
import { getComponent } from "../services/api/Component";

interface Params {
  id: string;
}

const ComponentTest = () => {
  const { id } = useParams<Params>();
  console.log("load")
  const [component, setComponent] = useState<Component>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getComponent(id)
      .then((component) => {
        setComponent(component);
        console.log(component);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);


  return <div>{JSON.stringify(component)}</div>;
};

export default ComponentTest;
