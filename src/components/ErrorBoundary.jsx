import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error, errorInfo) {
    const child = this.props.children;
    const componentName = this.getComponentName(child);
    const sectionName = this.props.name || this.props.section || componentName;
    
    // Enhanced error logging
    console.group(`🔥 Error Boundary Caught Error in: ${sectionName}`);
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("Error Stack:", error.stack);
    
    // Log component hierarchy
    if (errorInfo.componentStack) {
      const components = this.parseComponentStack(errorInfo.componentStack);
      console.error("Component Hierarchy:", components);
    }
    
    console.groupEnd();

    // Store error info in state
    this.setState({ errorInfo });

    // Optional: Send to error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo, sectionName);
    }
  }

  getComponentName = (child) => {
    if (!child) return "Unknown";
    
    // Handle different types of React elements
    if (typeof child === 'string') return "TextNode";
    if (typeof child === 'number') return "NumberNode";
    if (Array.isArray(child)) return "Fragment";
    
    // Get component name from different sources
    const type = child.type;
    if (!type) return "Unknown";
    
    return type.displayName || 
           type.name || 
           (typeof type === 'string' ? type : "Anonymous");
  };

  parseComponentStack = (componentStack) => {
    return componentStack
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim())
      .slice(0, 10); // Limit to first 10 components for readability
  };

  getErrorLocation = () => {
    if (!this.state.error?.stack) return "Location unknown";
    
    const stack = this.state.error.stack;
    const lines = stack.split('\n');
    
    // Find first line that contains file information
    for (let line of lines) {
      if (line.includes('.js:') || line.includes('.jsx:') || line.includes('.ts:') || line.includes('.tsx:')) {
        // Extract file and line info
        const match = line.match(/([^/\\]+\.(js|jsx|ts|tsx)):(\d+):(\d+)/);
        if (match) {
          return `${match[1]} at line ${match[3]}:${match[4]}`;
        }
      }
    }
    return "Location unknown";
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  render() {
    if (this.state.hasError) {
      const child = this.props.children;
      const componentName = this.getComponentName(child);
      const sectionName = this.props.name || this.props.section || componentName;
      const errorLocation = this.getErrorLocation();

      return (
        <div className="bg-red-900 text-red-200 p-6 m-4 rounded-lg border-2 border-red-700">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">
              ⚠️ Error in Section: <span className="text-red-100">{sectionName}</span>
            </h2>
            <div className="text-sm text-red-300 mb-2">
              <strong>Error ID:</strong> {this.state.errorId}
            </div>
            <div className="text-sm text-red-300 mb-2">
              <strong>Location:</strong> {errorLocation}
            </div>
          </div>
          
          <div className="bg-red-800 p-3 rounded mb-4">
            <h3 className="font-semibold mb-2">Error Details:</h3>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {this.state.error?.toString()}
            </pre>
          </div>

          {this.state.errorInfo?.componentStack && (
            <div className="bg-red-800 p-3 rounded mb-4">
              <h3 className="font-semibold mb-2">Component Stack:</h3>
              <pre className="whitespace-pre-wrap text-xs font-mono max-h-32 overflow-y-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
            >
              🔄 Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
            >
              🔁 Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;