import { REACT_APP_MIC_API } from "../../constants/environment";
import { REPOSITORY_URL, COMPONENTS_URL, GIT_REPO_URL } from "../../constants/routes";
import { GitRepo } from "../../models/GitRepo";
import { Notebook } from "../../models/Notebook";

export const patchGitRepo = async (component_id: string, gitRepo: GitRepo, notebooks?: Notebook[]) => {
    try {
        const response = await fetch(`${REACT_APP_MIC_API}/${COMPONENTS_URL}/${component_id}/git-repo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...gitRepo
        })});
        if (response.ok) {
            const gitRepoResponse: GitRepo = await response.json();
            const responseNotebooks = notebooks?.map(async (notebook) => {
                const response = await fetch(`${REACT_APP_MIC_API}/git-repos/${gitRepoResponse.id}/notebooks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...notebook
                    })});
                if (response.ok) {
                    const notebook: Notebook = await response.json();
                    return notebook;
                }
            });
            return {
                ...gitRepoResponse,
                notebooks: responseNotebooks
            }
        }
        throw new Error(response.statusText);
    } catch (error) {
        throw new Error(error!.message);
    }
    
}


export const getNotebooks = async (id: string) => {
    try {
        const response = await fetch(`${REACT_APP_MIC_API}${GIT_REPO_URL}/${id}/notebooks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const data: Notebook[] = await response.json();
            return data;
        }
        throw new Error(response.statusText);
    } catch (error) {
        throw new Error(error!.message);
    }
};