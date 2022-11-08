import {useEffect, useState} from "react";
import { listComponents } from "../../services/api/Component";
import { Component } from "../../models/Component";

export const ListComponents = () => {
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        listComponents().then(
            (data) => {
                setLoading(true);
                const components = data
                setComponents(components);
                setLoading(false);
            }).catch(
            (error) => {
                setError(error.message);
            })
    }, []);

    return (
            <ul>
                {components.map((component) => (
                    <div key={component.id}>
                        <li>{component.name}</li>
                    </div>
                ))}
            </ul>
        )
}
