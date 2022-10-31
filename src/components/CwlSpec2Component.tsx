import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import convertCwl from "../adapters/cwl";
import { Component } from "../models/Component";
import { Notebook } from "../models/Notebook";
import { updateComponent } from "../services/api/Component";
import { createInputs } from "../services/api/Input";
import { createParameters } from "../services/api/Parameter";

interface Props {
    component: Component;
    notebook: Notebook;
}

const CwlSpec2Component = (props: Props) => {
    const { component, notebook } = props;
    const [newComponent, setNewComponent] = useState<Component>();
    const [status, setStatus] = useState("idle");
    const history = useHistory();
    useEffect(() => {
        const download = async () => {
            const response = await fetch(notebook.spec);
            setStatus("Converting CWL to Model Catalog component");
            const spec = await response.text();
            if (notebook.spec) {
                const tmpComponent = convertCwl(component, spec, notebook.spec);
                setNewComponent(tmpComponent);
                setStatus("Updating Model Catalog component");
                await createParameters(tmpComponent.id!, tmpComponent.parameters!);
                await createInputs(tmpComponent.id!, tmpComponent.inputs!);
                await updateComponent(tmpComponent);
                history.push(`/components/${tmpComponent.id}`);
            }
        };
        download();
    }, [component, notebook]);

    return (
        <div>
        </div>
    );
};

export default CwlSpec2Component;
