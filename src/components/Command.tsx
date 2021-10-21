import { Container } from "@mui/material";
import React from "react";

interface Props {
    command: string | undefined;
}
const Command = (props: Props) => {
    return (
        <Container>
            <p>{props.command}</p>
            
        </Container>
    )
}

export default Command