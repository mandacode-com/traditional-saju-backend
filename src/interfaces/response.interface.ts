export interface ResponseError {
  message: string;
  data: {
    error: string;
    path: string;
    timestamp: string;
  };
}
