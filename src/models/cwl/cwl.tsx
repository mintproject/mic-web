export interface IdMap<T> {
    [id: string]: T
}
export interface CommandLineObject  {
    baseCommand: string
    class: string,
    cwlVersion: string,
    hints: Hints,
    inputs: IdMap<Input>,
    outputs: IdMap<Output>,
    requirements: Requirements,
}



export interface Hints {
    DockerRequirement: DockerRequirement
}

export interface DockerRequirement {
    dockerImageId: string
}

export interface Input{
    inputBinding: InputBinding
    type: string
}

interface InputBinding {
    position?: string
    prefix?: string
}

export interface Output {
    outputBinding: OutputBinding
    type: string    
}


interface OutputBinding {
    glob: string
}

interface Requirements {
    NetworkAccess: NetworkAccess
}

interface NetworkAccess {
    networkAccess: boolean
}

export interface Model {
    name: string
    description: string
    type: string
    cwlspec: any
}