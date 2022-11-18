import { Box, Button, Container, Link, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardGrid from "../components/grids/CardGrid";
import { getNotebooks } from "../services/api/GitRepo";
import { Notebook } from "../models/Notebook";
import convertCwl from "../adapters/cwl";
import { getComponent } from "../services/api/Component";
import CwlSpec2Component from "../components/CwlSpec2Component";
import { Component } from "../models/Component";
interface Params {
    componentId: string;
    repositoryId: string;
}

export const Notebooks = (props: any) => {
    const { componentId, repositoryId } = useParams<Params>();
    const [error, setError] = useState("");
    const [notebooks, setNotebooks] = useState<Notebook[]>();
    const [component, setComponent] = useState<Component>();
    const [loading, setLoading] = useState(false);
    const [notebook, setNotebook] = useState<Notebook>();

    useEffect(() => {
        const fetchNotebooks = async () => {
            setLoading(true);
            try {
                const notebooks = await getNotebooks(repositoryId);
                setNotebooks(notebooks);
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        };

        const fetchComponent = async () => {
            setLoading(true);
            try {
                const component = await getComponent(componentId);
                setComponent(component);
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        };
        fetchComponent();
        fetchNotebooks();
    }, [repositoryId]);

    return (
        <Container maxWidth="md">
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                {notebooks && component && (
                    <>
                        <Typography variant="h4">Notebook</Typography>
                        <Typography variant="body1">
                            Notebook{notebooks?.length > 1 && `s`} detected on: {component?.gitRepo?.url}
                        </Typography>
                        <CardGrid>
                            {notebooks.map((notebook) => {
                                return (
                                    <Box key={notebook.id} p={2}>
                                        <Typography variant="h6">
                                            <Link href={notebook.spec}>{notebook.name}</Link>
                                        </Typography>
                                        <Typography variant="body1">Inferred by: {notebook.inferredBy}</Typography>
                                        <Button
                                            disabled={loading}
                                            onClick={() => {
                                                setLoading(true);
                                                setNotebook(notebook);
                                                setLoading(false);
                                            }}
                                            variant="outlined"
                                        >
                                            Use as a your component
                                        </Button>
                                    </Box>
                                );
                            })}
                        </CardGrid>
                    </>
                )}
                {notebook && component && <CwlSpec2Component component={component} notebook={notebook} />}
            </Paper>
        </Container>
    );
};
export default Notebooks;
