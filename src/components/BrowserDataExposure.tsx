'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Globe, 
  Monitor, 
  Smartphone, 
  MapPin, 
  Clock, 
  Wifi, 
  AlertTriangle,
  Info,
  RefreshCw,
  Copy,
  CheckCircle
} from 'lucide-react';

interface BrowserData {
  basic: {
    userAgent: string;
    language: string;
    languages: string[];
    platform: string;
    cookieEnabled: boolean;
    doNotTrack: string | null;
    onLine: boolean;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
    availWidth: number;
    availHeight: number;
  };
  window: {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
    devicePixelRatio: number;
  };
  timezone: {
    timezone: string;
    timezoneOffset: number;
    locale: string;
  };
  network: {
    connectionType: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
  } | null;
  webgl: {
    vendor: string;
    renderer: string;
  } | null;
  canvas: {
    fingerprint: string;
  } | null;
  plugins: string[];
  webrtc: {
    localIP: string | null;
  } | null;
}

export function BrowserDataExposure() {
  const [browserData, setBrowserData] = useState<BrowserData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const collectBrowserData = async (): Promise<BrowserData> => {
    const data: BrowserData = {
      basic: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? Array.from(navigator.languages) : [],
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        onLine: navigator.onLine,
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      timezone: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
      },
      network: null,
      webgl: null,
      canvas: null,
      plugins: [],
      webrtc: { localIP: null },
    };

    // Network Information
    if ('connection' in navigator) {
      const connection = (navigator as { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number } }).connection;
      data.network = {
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
      };
    }

    // WebGL Information
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && 'getExtension' in gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          data.webgl = {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown',
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown',
          };
        } else {
          data.webgl = {
            vendor: 'Unknown',
            renderer: 'Unknown',
          };
        }
      }
    } catch {
      console.log('WebGL not available');
    }

    // Canvas Fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 200;
        canvas.height = 50;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint test 🔒', 2, 2);
        data.canvas = {
          fingerprint: canvas.toDataURL().substr(0, 50) + '...',
        };
      }
    } catch {
      console.log('Canvas fingerprinting not available');
    }

    // Plugin Information
    if (navigator.plugins && navigator.plugins.length > 0) {
      data.plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
    }

    return data;
  };

  const loadBrowserData = useCallback(async () => {
    setLoading(true);
    const data = await collectBrowserData();
    setBrowserData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBrowserData();
  }, [loadBrowserData]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItems(prev => new Set([...prev, key]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    });
  };

  const getRiskLevel = (category: string): { level: string; color: string; description: string } => {
    const risks = {
      userAgent: { level: 'HIGH', color: 'bg-red-100 text-red-800', description: 'Unique browser and OS identification' },
      screen: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Screen fingerprinting for tracking' },
      timezone: { level: 'HIGH', color: 'bg-red-100 text-red-800', description: 'Geographic location inference' },
      webgl: { level: 'HIGH', color: 'bg-red-100 text-red-800', description: 'Unique hardware fingerprinting' },
      canvas: { level: 'HIGH', color: 'bg-red-100 text-red-800', description: 'Persistent tracking fingerprint' },
      network: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Connection profiling' },
      plugins: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Software environment detection' },
    };
    return risks[category as keyof typeof risks] || { level: 'LOW', color: 'bg-green-100 text-green-800', description: 'Minimal privacy risk' };
  };

  if (!browserData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Analyzing browser data exposure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-orange-900 mb-2">Privacy & Data Protection Notice</h4>
              <p className="text-orange-800 mb-3">
                <strong>🔒 Your Privacy is Protected:</strong> This educational tool demonstrates browser data exposure 
                for privacy awareness. <strong>We do NOT collect, store, save, or transmit ANY of your personal information 
                to our servers or any third parties.</strong>
              </p>
              <div className="bg-orange-100 rounded-lg p-3 mb-3">
                <p className="text-sm text-orange-800 font-medium mb-2">What happens to your data:</p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>✅ All analysis happens <strong>locally in your browser only</strong></li>
                  <li>✅ Data is <strong>immediately discarded when you close this tab</strong></li>
                  <li>✅ <strong>No server communication</strong> - everything stays on your device</li>
                  <li>✅ <strong>No cookies, tracking, or data storage</strong> by PrivacyAnalyzer</li>
                </ul>
              </div>
              <p className="text-sm text-orange-700">
                This tool demonstrates what information websites <em>can</em> access from your browser, 
                helping you understand your digital fingerprint and take protective measures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsVisible(!isVisible)}
            className={`flex items-center gap-2 ${isVisible ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isVisible ? 'Hide Data' : 'Reveal Browser Data'}
          </Button>
          <Badge variant="outline" className="gap-2">
            <Info className="h-3 w-3" />
            {Object.keys(browserData).filter(key => browserData[key as keyof BrowserData] !== null).length} Data Categories Detected
          </Badge>
        </div>
        
        <Button
          variant="outline"
          onClick={loadBrowserData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {isVisible && (
        <div className="grid gap-6">
          {/* Basic Browser Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">Basic Browser Information</h3>
                </div>
                <Badge className={getRiskLevel('userAgent').color}>
                  {getRiskLevel('userAgent').level} RISK
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{getRiskLevel('userAgent').description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">User Agent:</span>
                    <p className="text-sm text-gray-600 mt-1 break-all">{browserData.basic.userAgent}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(browserData.basic.userAgent, 'userAgent')}
                  >
                    {copiedItems.has('userAgent') ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Platform:</span>
                    <p className="text-sm text-gray-600">{browserData.basic.platform}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Language:</span>
                    <p className="text-sm text-gray-600">{browserData.basic.language}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Cookies Enabled:</span>
                    <p className="text-sm text-gray-600">{browserData.basic.cookieEnabled ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Do Not Track:</span>
                    <p className="text-sm text-gray-600">{browserData.basic.doNotTrack || 'Not Set'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Monitor className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold">Screen & Display Information</h3>
                </div>
                <Badge className={getRiskLevel('screen').color}>
                  {getRiskLevel('screen').level} RISK
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{getRiskLevel('screen').description}</p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Screen Resolution:</span>
                  <p className="text-sm text-gray-600">{browserData.screen.width} × {browserData.screen.height}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Available Space:</span>
                  <p className="text-sm text-gray-600">{browserData.screen.availWidth} × {browserData.screen.availHeight}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Color Depth:</span>
                  <p className="text-sm text-gray-600">{browserData.screen.colorDepth} bits</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Window Size:</span>
                  <p className="text-sm text-gray-600">{browserData.window.innerWidth} × {browserData.window.innerHeight}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Device Pixel Ratio:</span>
                  <p className="text-sm text-gray-600">{browserData.window.devicePixelRatio}x</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timezone & Location */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold">Timezone & Location Data</h3>
                </div>
                <Badge className={getRiskLevel('timezone').color}>
                  {getRiskLevel('timezone').level} RISK
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">{getRiskLevel('timezone').description}</p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Timezone:</span>
                  <p className="text-sm text-gray-600">{browserData.timezone.timezone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">UTC Offset:</span>
                  <p className="text-sm text-gray-600">{browserData.timezone.timezoneOffset} minutes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Locale:</span>
                  <p className="text-sm text-gray-600">{browserData.timezone.locale}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WebGL Hardware Information */}
          {browserData.webgl && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-semibold">Hardware Information (WebGL)</h3>
                  </div>
                  <Badge className={getRiskLevel('webgl').color}>
                    {getRiskLevel('webgl').level} RISK
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{getRiskLevel('webgl').description}</p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">GPU Vendor:</span>
                    <p className="text-sm text-gray-600 break-all">{browserData.webgl.vendor}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">GPU Renderer:</span>
                    <p className="text-sm text-gray-600 break-all">{browserData.webgl.renderer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Information */}
          {browserData.network && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold">Network Information</h3>
                  </div>
                  <Badge className={getRiskLevel('network').color}>
                    {getRiskLevel('network').level} RISK
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{getRiskLevel('network').description}</p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Connection Type:</span>
                    <p className="text-sm text-gray-600">{browserData.network.connectionType}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Effective Type:</span>
                    <p className="text-sm text-gray-600">{browserData.network.effectiveType}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Downlink:</span>
                    <p className="text-sm text-gray-600">{browserData.network.downlink} Mbps</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <span className="font-medium">Round Trip Time:</span>
                    <p className="text-sm text-gray-600">{browserData.network.rtt} ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Canvas Fingerprint */}
          {browserData.canvas && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-semibold">Canvas Fingerprint</h3>
                  </div>
                  <Badge className={getRiskLevel('canvas').color}>
                    {getRiskLevel('canvas').level} RISK
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{getRiskLevel('canvas').description}</p>
                
                <div className="p-3 bg-gray-50 rounded">
                  <span className="font-medium">Canvas Hash (truncated):</span>
                  <p className="text-sm text-gray-600 break-all font-mono">{browserData.canvas.fingerprint}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Browser Plugins */}
          {browserData.plugins.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <h3 className="text-xl font-semibold">Browser Plugins</h3>
                  </div>
                  <Badge className={getRiskLevel('plugins').color}>
                    {getRiskLevel('plugins').level} RISK
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">{getRiskLevel('plugins').description}</p>
                
                <div className="space-y-2">
                  {browserData.plugins.map((plugin, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {plugin}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Protection Tips */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900">Privacy Protection Tips</h3>
              </div>
              
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Use privacy-focused browsers like Firefox with strict privacy settings or Tor Browser</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Enable browser extensions that block fingerprinting (uBlock Origin, Privacy Badger)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Disable JavaScript for sensitive browsing or use NoScript extension</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Use VPN services to mask your real IP address and location</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Regularly clear cookies, cache, and browser data</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Consider using multiple browsers for different activities (work, personal, shopping)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}