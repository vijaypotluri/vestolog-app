import { NavigateFunction } from 'react-router-dom';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

export const handleApiError = (error: any, navigate?: NavigateFunction) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const statusCode = error.response.status;
    
    switch (statusCode) {
      case 401:
      case 403:
        if (navigate) {
          navigate('/403');
        }
        break;
      case 404:
        if (navigate) {
          navigate('/404');
        }
        break;
      case 500:
        if (navigate) {
          navigate('/500');
        }
        break;
      default:
        if (navigate) {
          navigate('/error');
        }
        break;
    }
    
    throw new AppError(error.response.data?.message || 'Request failed', statusCode);
  } else if (error.request) {
    // The request was made but no response was received
    throw new AppError('Network error - please check your connection', 0);
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new AppError(error.message || 'An unexpected error occurred', 500);
  }
};

export const createErrorBoundaryFallback = (error: Error, errorInfo: any) => {
  console.error('Error Boundary caught an error:', error, errorInfo);
  
  // You can send error to logging service here
  // logErrorToService(error, errorInfo);
};
