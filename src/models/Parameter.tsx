export interface Parameter {
  id?: string;
  name: string;
  displayName?: string;
  description?: string;
  type?: string;
  unit?: string;
  unit_description?: string;
  data_type?: string;
  default?: number | string | boolean;
  choices?: string[];
  min?: number;
  max?: number;
  prefix?: string;
}