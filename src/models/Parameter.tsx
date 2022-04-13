export interface Parameter {
  id?: string;
  name: string;
  display_name?: string;
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