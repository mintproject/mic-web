export default interface CommandLineObject  {
    baseCommand: string
}

export interface Model {
    name: string
    description: string
    type: string
    cwl_spec: any
}