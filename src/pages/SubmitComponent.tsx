import { convertModelConfiguration } from "../adapters/modelCatalog";
import ModelSelector from "../components/ModelSelector";
import { Component } from "../models/Component";

interface Props {
    component: Component;
}


const SubmitComponent = (props: Props) => {

    return <ModelSelector component={props.component} modelConfiguration={convertModelConfiguration(props.component)}/>;
};

export default SubmitComponent;
