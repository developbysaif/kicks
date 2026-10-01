import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 text-2xl font-black">
            K
          </div>
          <h1 className="text-2xl font-black">Kick Home Care</h1>
          <p className="text-xs text-slate-300 mt-2 max-w-sm">
            Welcome to Kick Home Care. Please click below to refresh the brand experience.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg transition-all"
          >
            Reload Kick Storefront
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
