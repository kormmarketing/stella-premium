import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F0F10',
            color: '#EAEAEA',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            padding: '24px',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5 }}>
            Произошла ошибка, обновите страницу
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
