import React, { useEffect, useState } from "react";
import { parse, stringify } from "yaml";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper, Typography } from "@mui/material";
import { Redirect } from "react-router-dom";
import { CommandLineObject } from "../models/cwl/cwl";
import { Parameter } from "../models/Parameter";
import { Input } from "../models/Input";
import { Component } from "../models/Component";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

function getParametersCwl(data: CommandLineObject): Parameter[] {
  console.log(data);
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type !== "File") {
        return {
          name: key,
          displayName: key,
          description: key,
          prefix: value?.inputBinding.prefix,
          type: value?.type,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}

function getFilesCwl(data: CommandLineObject): Input[] {
  return Object.entries(data.inputs)
    .map(([key, value], index) => {
      if (value?.type === "File") {
        return {
          name: key,
          displayName: key,
          description: key,
          prefix: value?.inputBinding.prefix,
        };
      }
      return undefined;
    })
    .filter(notEmpty);
}


const convertCwl = (component: Component, spec: string, spec_url: string): Component => {
    const specCwl = parse(spec);
    const dockerImage = specCwl.hints.DockerRequirement.dockerImageId;
    component.dockerImage = dockerImage;
    component.parameters = getParametersCwl(specCwl);
    component.inputs = getFilesCwl(specCwl);

    const newComponent : Component = {
        id: component.id,
        hasComponentLocation: spec_url,
        name: component.name,
        description: component.description,
        type: component.type,
        dockerImage: dockerImage,
        inputs: component.inputs,
        parameters: component.parameters,
        outputs: component.outputs,

    }
    return newComponent;
}

export default convertCwl;