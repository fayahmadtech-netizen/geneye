export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}
