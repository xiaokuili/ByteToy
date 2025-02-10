
export interface Param {
  name: string;
  type: string;
  description: string;
  required: boolean;
  value: string | number | boolean ;
}

export interface Params {
  [key: string]: Param;
}
