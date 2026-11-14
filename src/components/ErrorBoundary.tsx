import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Top-level Resilience Error Boundary that prevents uncaught UI exceptions from crashing
 * the NEXORA AI learning workspace and provides instant state recovery.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering issue occurred.',
    };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Error captured safely in component state without exposing raw stack traces
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#09070f] text-slate-100 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-[#120d1d] border border-pink-500/30 rounded-3xl p-8 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-rose-400" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-display">
                NEXORA AI Workspace Recovery
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                {this.state.errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Resume Learning Session</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
