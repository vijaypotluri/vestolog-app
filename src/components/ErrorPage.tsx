import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  subTitle?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  title,
  subTitle,
  onRetry,
  showHomeButton = true
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  // Default configurations for different status codes
  const getErrorConfig = (code: number) => {
    switch (code) {
      case 403:
        return {
          status: "403" as const,
          title: title || "Access Denied",
          subTitle: subTitle || "You don't have permission to access this resource."
        };
      case 404:
        return {
          status: "404" as const,
          title: title || "Page Not Found",
          subTitle: subTitle || "The page you're looking for doesn't exist."
        };
      case 500:
        return {
          status: "500" as const,
          title: title || "Server Error",
          subTitle: subTitle || "Something went wrong on our end. Please try again later."
        };
      default:
        return {
          status: "500" as const,
          title: title || "Something went wrong",
          subTitle: subTitle || "We're sorry, but something unexpected happened. Please try again."
        };
    }
  };

  const config = statusCode ? getErrorConfig(statusCode) : getErrorConfig(500);

  const actions = [];
  
  if (onRetry) {
    actions.push(
      <Button type="primary" onClick={onRetry} key="retry">
        Try Again
      </Button>
    );
  }
  
  if (showHomeButton) {
    actions.push(
      <Button onClick={handleGoHome} key="home">
        Go Home
      </Button>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Result
        status={config.status}
        title={config.title}
        subTitle={config.subTitle}
        extra={actions}
      />
    </div>
  );
};
