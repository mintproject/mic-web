import { Component } from "../models/Component";
import {
    DatasetSpecification,
    Parameter as ModelCatalogParameter,
    ModelConfiguration as ModelCatalogModelConfiguration,
} from "@mintproject/modelcatalog_client";

export const convertParameterToModelCatalog = (model: Component): ModelCatalogParameter[] => {
    return model.parameters
        ? model.parameters?.map((parameter) => {
              return {
                  label: [parameter.displayName || parameter.name],
                  description: [parameter.description || parameter.name],
                  hasDataType: parameter.type ? [parameter.type] : [],
                  type: ["Parameter"],
              } as ModelCatalogParameter;
          })
        : ([] as ModelCatalogParameter[]);
};

export const convertInputsDataset = (model: Component): DatasetSpecification[] => {
    return model.inputs
        ? model.inputs?.map((input) => {
              return {
                  label: [input.displayName || input.name],
                  description: [input.description || input.name],
                  type: ["DatasetSpecification"],
              } as DatasetSpecification;
          })
        : ([] as DatasetSpecification[]);
};

export const convertOutputDataset = (model: Component): DatasetSpecification[] => {
    return model.outputs
        ? model.outputs?.map((item) => {
              return {
                  label: [item.displayName || item.name],
                  description: [item.description || item.name],
                  path_location: [item.match],
              } as DatasetSpecification;
          })
        : ([] as DatasetSpecification[]);
};

export const convertModelConfiguration = (component: Component): ModelCatalogModelConfiguration => {
    const newModelConfiguration: ModelCatalogModelConfiguration = {
        label: [component?.name as string],
        description: [component?.description as string],
        hasInput: convertInputsDataset(component as Component),
        hasParameter: convertParameterToModelCatalog(component as Component),
        hasComponentLocation: [component.hasComponentLocation!]
    };
    return newModelConfiguration;
};
