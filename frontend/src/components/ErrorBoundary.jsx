import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-vc-gray">
          <div className="card max-w-md w-full text-center p-8 shadow-vc-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-vc-red" />
            </div>
            <h2 className="text-xl font-bold text-vc-navy mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              An error occurred while rendering this page. This is usually caused by a component or library issue.
            </p>
            <div className="bg-red-50 text-red-700 text-xs font-mono p-4 rounded-xl mb-6 overflow-auto text-left max-h-[150px] border border-red-100">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full justify-center py-3 text-sm ripple"
            >
              <RefreshCw className="h-4 w-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
