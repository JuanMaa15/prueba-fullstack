export interface ValidationErrorItem {
  file: string;
  message: string;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code: number;
  errors?: ValidationErrorItem[];
}

export interface SuccessResponse<T = unknown> {
  status: 'success';
  message: string;
  code: number;
  data: T;
}
