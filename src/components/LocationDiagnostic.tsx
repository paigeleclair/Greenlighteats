import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: string;
}

export function LocationDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Test 1: Check if Geolocation API exists
    addResult({
      test: 'Geolocation API',
      status: 'loading',
      message: 'Checking if browser supports geolocation...'
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!navigator.geolocation) {
      addResult({
        test: 'Geolocation API',
        status: 'error',
        message: 'Geolocation API not supported',
        details: 'Your browser does not support the Geolocation API. Try updating your browser.'
      });
      setIsRunning(false);
      return;
    }
    
    addResult({
      test: 'Geolocation API',
      status: 'success',
      message: 'Geolocation API is available',
      details: 'navigator.geolocation is defined'
    });
    
    // Test 2: Check protocol
    addResult({
      test: 'HTTPS Protocol',
      status: 'loading',
      message: 'Checking if site uses HTTPS...'
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isSecure = window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';
    
    if (!isSecure) {
      addResult({
        test: 'HTTPS Protocol',
        status: 'error',
        message: 'Site must use HTTPS for geolocation',
        details: `Current protocol: ${window.location.protocol}`
      });
    } else {
      addResult({
        test: 'HTTPS Protocol',
        status: 'success',
        message: 'Protocol is secure',
        details: `Protocol: ${window.location.protocol}, Host: ${window.location.hostname}`
      });
    }
    
    // Test 3: Check permission state
    if (navigator.permissions) {
      addResult({
        test: 'Permission State',
        status: 'loading',
        message: 'Checking permission state...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        
        let status: 'success' | 'error' | 'warning' = 'success';
        let message = '';
        
        switch (permissionStatus.state) {
          case 'granted':
            status = 'success';
            message = 'Permission granted';
            break;
          case 'denied':
            status = 'error';
            message = 'Permission denied';
            break;
          case 'prompt':
            status = 'warning';
            message = 'Permission not yet requested';
            break;
        }
        
        addResult({
          test: 'Permission State',
          status,
          message,
          details: `Permission state: "${permissionStatus.state}"`
        });
      } catch (e) {
        addResult({
          test: 'Permission State',
          status: 'warning',
          message: 'Could not query permission state',
          details: String(e)
        });
      }
    } else {
      addResult({
        test: 'Permission State',
        status: 'warning',
        message: 'Permissions API not available',
        details: 'Cannot check permission state (older browser)'
      });
    }
    
    // Test 4: Try to get actual location
    addResult({
      test: 'Get Location',
      status: 'loading',
      message: 'Attempting to get your location...'
    });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        addResult({
          test: 'Get Location',
          status: 'success',
          message: 'Successfully got location!',
          details: `Latitude: ${position.coords.latitude.toFixed(6)}, Longitude: ${position.coords.longitude.toFixed(6)}, Accuracy: ${position.coords.accuracy.toFixed(0)}m`
        });
        setIsRunning(false);
      },
      (error) => {
        let message = 'Failed to get location';
        let details = '';
        let status: 'error' | 'warning' = 'error';
        
        // Check for permissions policy error
        if (error.message && error.message.includes('permissions policy')) {
          status = 'error';
          message = '🚫 Permissions Policy Blocking Geolocation';
          details = `CRITICAL: "${error.message}"\n\nThis means geolocation is disabled at the hosting/browser level, not by user permission. This is a Figma Make environment limitation. The app will use mock restaurant data instead.`;
        } else {
          switch (error.code) {
            case 1:
              message = 'Permission denied';
              details = 'User denied the location request. Check browser settings.';
              break;
            case 2:
              message = 'Position unavailable';
              details = 'Location information is unavailable. Check device settings.';
              break;
            case 3:
              message = 'Request timeout';
              details = 'Location request timed out. Try again.';
              break;
            default:
              details = error.message || 'Unknown error';
          }
        }
        
        addResult({
          test: 'Get Location',
          status,
          message,
          details: error.message?.includes('permissions policy') ? details : `Error code: ${error.code}. ${details}`
        });
        setIsRunning(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'loading':
        return <Loader className="text-blue-500 animate-spin" size={20} />;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-primary" size={24} />
          <h2 className="text-xl">Location Diagnostic Tool</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          This tool will run a series of tests to diagnose location access issues.
        </p>
        
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed mb-6 transition-colors"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>
        
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index}
                className="border border-border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(result.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm">{result.test}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        result.status === 'success' ? 'bg-green-500/10 text-green-500' :
                        result.status === 'error' ? 'bg-red-500/10 text-red-500' :
                        result.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground font-mono bg-secondary p-2 rounded mt-2 break-all">
                        {result.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {results.length > 0 && !isRunning && (
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h3 className="font-medium text-sm mb-2">What to do next:</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li><strong>If "permissions policy" error:</strong> This is a Figma Make environment limitation. Geolocation is disabled at the hosting level and cannot be enabled by user permissions. The app will automatically use mock restaurant data instead. On standard hosting (Vercel, Netlify, etc.), the real API would work perfectly.</li>
              <li><strong>If permission denied:</strong> Click the lock icon in your browser's address bar and allow location access</li>
              <li><strong>If position unavailable:</strong> Check that location services are enabled on your device</li>
              <li><strong>If timeout:</strong> Your device may be having trouble getting a GPS fix. Try again or connect to WiFi</li>
              <li><strong>If HTTPS error:</strong> The site must be accessed via https:// for location to work</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
