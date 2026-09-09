import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;

    if (hasError) {
      const isDev = import.meta.env.MODE === 'development';

      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary-icon" aria-hidden="true">⚠️</div>
          <h1 className="error-boundary-title">Something went wrong</h1>
          <p className="error-boundary-message">
            {error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {isDev && errorInfo && (
            <pre className="error-boundary-details">
              {errorInfo.componentStack}
            </pre>
          )}
          <button className="error-boundary-btn" onClick={this.handleReload} type="button">
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}
