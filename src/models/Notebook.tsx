export interface Notebook {
    id?: string;
    name?: string;
    localPath: string;
    remotePath: string;
    inferredBy: string;
    specs: string;
}