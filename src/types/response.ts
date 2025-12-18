export interface ErrorResponse {
  error: string;
  code?: string;
  timestamp?: number;
}

export interface SuccessResponse {
  message: string;
  success: boolean;
  timestamp: number;
}
