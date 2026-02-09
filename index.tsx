
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

type RootErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class RootErrorBoundary extends React.Component<React.PropsWithChildren, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // Keep full diagnostics in console for debugging.
    console.error('Root render error:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '680px', width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 10px 24px rgba(15,23,42,.08)' }}>
          <h1 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>页面渲染异常（已拦截，避免白屏）</h1>
          <p style={{ margin: '10px 0 0', color: '#334155', lineHeight: 1.6 }}>
            最近一次改动导致运行时异常，页面没有继续空白。请根据浏览器控制台报错定位字段或 JSX 语法问题。
          </p>
          <pre style={{ margin: '12px 0 0', padding: '10px', background: '#f1f5f9', borderRadius: '8px', color: '#0f172a', overflowX: 'auto', fontSize: '12px' }}>
            {this.state.message || 'Unknown render error'}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ marginTop: '12px', height: '36px', padding: '0 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
          >
            刷新重试
          </button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
