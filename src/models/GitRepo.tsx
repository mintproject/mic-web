import { Notebook } from "./Notebook";

export interface GitRepo {
    id?: string;
    url?: string;
    ref?: string;
    dockerImage?: string
    notebooks?: Notebook[]
}