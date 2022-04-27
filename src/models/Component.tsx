import { Container } from "./Container";
import { CommandLineObject } from "./cwl/cwl";
import { Directive } from "./Directive";
import { GitRepo } from "./GitRepo";
import { Input } from "./Input";
import { Output } from "./Output";
import { Parameter } from "./Parameter";

export interface Component {
  id?: string;
  name: string;
  display_name?: string;
  description?: string;
  type?: string;
  cwlspec?: CommandLineObject;
  docker_image?: string;
  parameters?: Parameter[];
  container?: Container;
  directives?: Directive[];
  model_id?: string;
  version_id?: string;
  outputs?: Output[];
  inputs?: Input[];
  gitRepo?: GitRepo;
}