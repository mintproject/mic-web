import { useHistory, useParams } from "react-router-dom";

import { Paper, Box, TextField, Typography, Button, Container } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import React from "react";
import { Component } from "../models/Component";
import { getComponent, updateComponent } from "../services/api/Component";
import InputGrid from "../components/grids/InputGrid";
import OutputGrid from "../components/grids/OutputGrid";
import ParameterGrid from "../components/grids/ParameterGrid";
import { COMPONENTS_URL } from "../constants/routes";
import SubmitComponent from "./SubmitComponent";
import { convertModelConfiguration } from "../adapters/modelCatalog";

interface Props {
    componentId: string;
}

const ComponentSummary = () => {
    const props = useParams<Props>();
    const history = useHistory();
    const [component, setComponent] = useState<Component>();
    const [success, setSuccess] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        const getComponentData = async () => {
            const data = await getComponent(props.componentId);
            setComponent(data);
        };

        getComponentData();
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //todo: save component
        const saveComponent = async () => {
            setSaving(true);
            try {
                const response = await updateComponent(component as Component);
            } catch (error) {
                let message;
                setSaving(false);
                if (error instanceof Error) message = error.message;
                else message = String(error);
            }
            setSuccess(true);
        };
        saveComponent();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const { name, value } = event.target;
        setComponent((prevModel) => ({ ...prevModel, [name]: value }));
    };

    return (
        <Container maxWidth="md">
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                {success && component && <SubmitComponent component={component} />}
                {!success && (
                    <>
                        <Typography variant="h6" color="inherit" gutterBottom>
                            Component summary
                        </Typography>
                        <Typography variant="body1" color="inherit" gutterBottom>
                            Provide metadata and verify inputs and outputs of your component
                        </Typography>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <TextField
                                required
                                fullWidth
                                id="display"
                                placeholder="Display Name"
                                name="name"
                                value={component?.name}
                                helperText="Name of the component: e.g. 'Implementation of MODFLOW model using R package and calibrated for the Texas Region' "
                                variant="outlined"
                                onChange={handleChange}
                            />

                            <TextField
                                required
                                fullWidth
                                id="description"
                                helperText="Description of the component"
                                placeholder="Description"
                                name="description"
                                value={component?.description}
                                variant="outlined"
                                onChange={handleChange}
                            />

                            <h3> Inputs </h3>
                            {component?.inputs ? <InputGrid inputs={component.inputs} /> : "None"}

                            <h3> Parameters </h3>
                            {component?.parameters ? <ParameterGrid parameters={component.parameters} /> : "None"}

                            <h3> Outputs </h3>
                            {component?.outputs && <OutputGrid outputs={component.outputs} />}
                            {/* {<OutputModalNew id={component?.id as string} />} */}

                            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                                <Button type="submit" variant="contained">
                                    {saving ? "Saving" : "Save"}
                                </Button>
                            </Box>
                        </form>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ComponentSummary;
