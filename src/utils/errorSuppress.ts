/**
 * Utility to suppress ResizeObserver errors that can cause UI breaks
 * This is a known issue with Material-UI and some third-party components
 */

// Suppress ResizeObserver loop errors
const resizeObserverErrorSuppress = () => {
  const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
  const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
  
  if (resizeObserverErr) {
    resizeObserverErr.setAttribute('style', 'display: none');
  }
  if (resizeObserverErrDiv) {
    resizeObserverErrDiv.setAttribute('style', 'display: none');
  }
};

// Override ResizeObserver error handling
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.' || 
      e.message === 'ResizeObserver loop limit exceeded') {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    resizeObserverErrorSuppress();
    return false;
  }
});

// Also catch unhandled promise rejections related to ResizeObserver
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && typeof e.reason === 'string' && 
      (e.reason.includes('ResizeObserver') || e.reason.includes('resize observer'))) {
    e.preventDefault();
    return false;
  }
});

// Override console.error to filter ResizeObserver errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('ResizeObserver') || 
      message.includes('resize observer') ||
      message.includes('loop completed with undelivered notifications')) {
    return; // Suppress the error
  }
  originalConsoleError.apply(console, args);
};

export { resizeObserverErrorSuppress }; 