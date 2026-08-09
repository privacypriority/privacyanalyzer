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
  Clock, 
  Wifi, 
  AlertTriangle,
  Info,
  RefreshCw,
  Copy,
  CheckCircle,
  Shield,
  Cpu,
  HardDrive,
  Navigation,
  Fingerprint,
  Lock,
  Zap,
  Activity
} from 'lucide-react';

interface ComprehensiveBrowserData {
  // Basic Browser Info
  basic: {
    userAgent: string;
    language: string;
    languages: string[];
    platform: string;
    cookieEnabled: boolean;
    doNotTrack: string | null;
    onLine: boolean;
    javaEnabled: boolean;
    buildID?: string;
    product: string;
    productSub: string;
    vendor: string;
    vendorSub: string;
    appCodeName: string;
    appName: string;
    appVersion: string;
    oscpu?: string;
  };

  // Screen and Display
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    orientation?: string;
    touchSupport: boolean;
    maxTouchPoints: number;
    msMaxTouchPoints?: number;
    pointerEnabled: boolean;
    devicePixelRatio: number;
  };

  // Window and Viewport
  window: {
    innerWidth: number;
    innerHeight: number;
    outerWidth: number;
    outerHeight: number;
    scrollX: number;
    scrollY: number;
    screenX: number;
    screenY: number;
    closed: boolean;
    frameElement: boolean;
    length: number;
    name: string;
    locationbar: boolean;
    menubar: boolean;
    personalbar: boolean;
    scrollbars: boolean;
    statusbar: boolean;
    toolbar: boolean;
    top: boolean;
    parent: boolean;
  };

  // Date/Time/Timezone
  datetime: {
    timezone: string;
    timezoneOffset: number;
    locale: string;
    dateFormat: string;
    timeFormat: string;
    currentTime: string;
    uptime: number;
  };

  // Network Information
  network: {
    connectionType: string;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
    onLine: boolean;
  } | null;

  // Hardware Information
  hardware: {
    deviceMemory?: number;
    hardwareConcurrency: number;
    maxTouchPoints: number;
    battery?: {
      charging: boolean;
      chargingTime: number;
      dischargingTime: number;
      level: number;
    };
  };

  // WebGL and Graphics
  webgl: {
    vendor: string;
    renderer: string;
    version: string;
    shadingLanguageVersion: string;
    extensions: string[];
    maxTextureSize: number;
    maxRenderBufferSize: number;
    maxViewportDimensions: number[];
    aliasedLineWidthRange: number[];
    aliasedPointSizeRange: number[];
  } | null;

  // Canvas Fingerprinting
  canvas: {
    textFingerprint: string;
    geometryFingerprint: string;
    webglFingerprint: string;
  } | null;

  // Audio Context
  audio: {
    sampleRate: number;
    baseLatency: number;
    outputLatency: number;
    contextState: string;
    maxChannelCount: number;
  } | null;

  // Fonts
  fonts: {
    available: string[];
    count: number;
  };

  // Plugins and Extensions
  plugins: {
    list: string[];
    count: number;
    mimeTypes: string[];
  };

  // WebRTC
  webrtc: {
    localIPs: string[];
    stunSupport: boolean;
    turnSupport: boolean;
    dtlsSupport: boolean;
  } | null;

  // Storage
  storage: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webSQL: boolean;
    cookies: boolean;
    quota?: number;
    usage?: number;
  };

  // Permissions
  permissions: {
    notifications: string;
    geolocation: string;
    camera: string;
    microphone: string;
    midi: string;
    push: string;
    clipboard: string;
  };

  // Features and APIs
  features: {
    webGL: boolean;
    webGL2: boolean;
    canvas: boolean;
    svg: boolean;
    webWorkers: boolean;
    webAssembly: boolean;
    serviceWorkers: boolean;
    webRTC: boolean;
    websockets: boolean;
    webAudio: boolean;
    geolocation: boolean;
    deviceOrientation: boolean;
    deviceMotion: boolean;
    touchEvents: boolean;
    pointerEvents: boolean;
    gamepad: boolean;
    vr: boolean;
    ar: boolean;
    paymentRequest: boolean;
    credentials: boolean;
    wakeLock: boolean;
    fullscreen: boolean;
    pictureInPicture: boolean;
    mediaDevices: boolean;
    speechSynthesis: boolean;
    speechRecognition: boolean;
  };

  // Security Features
  security: {
    https: boolean;
    secureContext: boolean;
    crossOriginIsolated: boolean;
    hsts: boolean;
    mixedContent: string;
    contentSecurityPolicy: boolean;
    subresourceIntegrity: boolean;
  };

  // Performance
  performance: {
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
    connection?: {
      downlink: number;
      effectiveType: string;
      rtt: number;
    };
    timing: {
      navigationStart: number;
      loadEventEnd: number;
      domContentLoadedEventEnd: number;
    };
  };
}

export function BrowserDataExposureEnhanced() {
  const [browserData, setBrowserData] = useState<ComprehensiveBrowserData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [collectedDataPoints, setCollectedDataPoints] = useState(0);

  const collectComprehensiveBrowserData = async (): Promise<ComprehensiveBrowserData> => {
    
    const data: ComprehensiveBrowserData = {
      // Basic Browser Information
      basic: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? Array.from(navigator.languages) : [],
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        onLine: navigator.onLine,
        javaEnabled: (navigator as { javaEnabled?: () => boolean }).javaEnabled?.() || false,
        product: navigator.product,
        productSub: navigator.productSub,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        oscpu: (navigator as { oscpu?: string }).oscpu,
        buildID: (navigator as { buildID?: string }).buildID,
      },
      
      // Screen Information
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: (screen as { orientation?: { type: string } }).orientation?.type || 'unknown',
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        msMaxTouchPoints: (navigator as { msMaxTouchPoints?: number }).msMaxTouchPoints,
        pointerEnabled: 'PointerEvent' in window,
        devicePixelRatio: window.devicePixelRatio,
      },
      
      // Window Information
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        screenX: window.screenX,
        screenY: window.screenY,
        closed: window.closed,
        frameElement: window.frameElement !== null,
        length: window.length,
        name: window.name,
        locationbar: !!(window as { locationbar?: { visible: boolean } }).locationbar?.visible,
        menubar: !!(window as { menubar?: { visible: boolean } }).menubar?.visible,
        personalbar: !!(window as { personalbar?: { visible: boolean } }).personalbar?.visible,
        scrollbars: !!(window as { scrollbars?: { visible: boolean } }).scrollbars?.visible,
        statusbar: !!(window as { statusbar?: { visible: boolean } }).statusbar?.visible,
        toolbar: !!(window as { toolbar?: { visible: boolean } }).toolbar?.visible,
        top: window.top === window,
        parent: window.parent === window,
      },
      
      // DateTime Information
      datetime: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        dateFormat: new Intl.DateTimeFormat().format(new Date()),
        timeFormat: new Intl.DateTimeFormat(undefined, { 
          hour: 'numeric', 
          minute: 'numeric', 
          second: 'numeric' 
        }).format(new Date()),
        currentTime: new Date().toISOString(),
        uptime: performance.now(),
      },
      
      // Network Information
      network: null,
      
      // Hardware Information
      hardware: {
        deviceMemory: (navigator as { deviceMemory?: number }).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,
      },
      
      webgl: null,
      canvas: null,
      audio: null,
      fonts: { available: [], count: 0 },
      plugins: { list: [], count: 0, mimeTypes: [] },
      webrtc: null,
      
      // Storage
      storage: {
        localStorage: 'localStorage' in window,
        sessionStorage: 'sessionStorage' in window,
        indexedDB: 'indexedDB' in window,
        webSQL: 'openDatabase' in window,
        cookies: navigator.cookieEnabled,
      },
      
      // Permissions
      permissions: {
        notifications: 'default',
        geolocation: 'unknown',
        camera: 'unknown',
        microphone: 'unknown',
        midi: 'unknown',
        push: 'unknown',
        clipboard: 'unknown',
      },
      
      // Features
      features: {
        webGL: 'WebGLRenderingContext' in window,
        webGL2: 'WebGL2RenderingContext' in window,
        canvas: 'HTMLCanvasElement' in window,
        svg: 'SVGElement' in window,
        webWorkers: 'Worker' in window,
        webAssembly: 'WebAssembly' in window,
        serviceWorkers: 'serviceWorker' in navigator,
        webRTC: 'RTCPeerConnection' in window,
        websockets: 'WebSocket' in window,
        webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
        geolocation: 'geolocation' in navigator,
        deviceOrientation: 'DeviceOrientationEvent' in window,
        deviceMotion: 'DeviceMotionEvent' in window,
        touchEvents: 'ontouchstart' in window,
        pointerEvents: 'PointerEvent' in window,
        gamepad: 'getGamepads' in navigator,
        vr: 'getVRDisplays' in navigator,
        ar: 'xr' in navigator,
        paymentRequest: 'PaymentRequest' in window,
        credentials: 'credentials' in navigator,
        wakeLock: 'wakeLock' in navigator,
        fullscreen: 'requestFullscreen' in document.documentElement,
        pictureInPicture: 'pictureInPictureEnabled' in document,
        mediaDevices: 'mediaDevices' in navigator,
        speechSynthesis: 'speechSynthesis' in window,
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      },
      
      // Security
      security: {
        https: location.protocol === 'https:',
        secureContext: 'isSecureContext' in window ? window.isSecureContext : false,
        crossOriginIsolated: 'crossOriginIsolated' in window ? window.crossOriginIsolated : false,
        hsts: document.location.protocol === 'https:',
        mixedContent: 'mixed',
        contentSecurityPolicy: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
        subresourceIntegrity: document.querySelector('script[integrity], link[integrity]') !== null,
      },
      
      // Performance
      performance: {
        jsHeapSizeLimit: (performance as { memory?: { jsHeapSizeLimit?: number } }).memory?.jsHeapSizeLimit,
        totalJSHeapSize: (performance as { memory?: { totalJSHeapSize?: number } }).memory?.totalJSHeapSize,
        usedJSHeapSize: (performance as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize,
        timing: {
          navigationStart: performance.timing?.navigationStart || 0,
          loadEventEnd: performance.timing?.loadEventEnd || 0,
          domContentLoadedEventEnd: performance.timing?.domContentLoadedEventEnd || 0,
        },
      },
    };

    // Network Information
    if ('connection' in navigator) {
      const connection = (navigator as { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection;
      data.network = {
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
        onLine: navigator.onLine,
      };
    }

    // Battery Information
    try {
      const battery = await (navigator as { getBattery?: () => Promise<{ level?: number; charging?: boolean; chargingTime?: number; dischargingTime?: number }> }).getBattery?.();
      if (battery) {
        data.hardware.battery = {
          charging: battery.charging ?? false,
          chargingTime: battery.chargingTime ?? 0,
          dischargingTime: battery.dischargingTime ?? 0,
          level: battery.level ?? 0,
        };
      }
    } catch {
      // Battery API not available
    }

    // WebGL Information
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && 'getExtension' in gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        data.webgl = {
          vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
          renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
          version: gl.getParameter(gl.VERSION) || 'Unknown',
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || 'Unknown',
          extensions: gl.getSupportedExtensions() || [],
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0,
          maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0,
          maxViewportDimensions: gl.getParameter(gl.MAX_VIEWPORT_DIMS) || [0, 0],
          aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE) || [0, 0],
          aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) || [0, 0],
        };
      }
    } catch {
      // WebGL not available
    }

    // Canvas Fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Text fingerprint
        canvas.width = 200;
        canvas.height = 50;
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Hello, world! 🌍', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Hello, world! 🌍', 4, 17);
        const textFingerprint = canvas.toDataURL().substr(0, 100) + '...';

        // Geometry fingerprint
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(50, 50, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f60';
        ctx.stroke();
        ctx.fillStyle = '#069';
        ctx.fill();
        const geometryFingerprint = canvas.toDataURL().substr(0, 100) + '...';

        data.canvas = {
          textFingerprint,
          geometryFingerprint,
          webglFingerprint: 'WebGL not available',
        };
      }
    } catch {
      // Canvas not available
    }

    // Audio Context
    try {
      const AudioContext = window.AudioContext || (window as { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        data.audio = {
          sampleRate: audioCtx.sampleRate,
          baseLatency: audioCtx.baseLatency || 0,
          outputLatency: audioCtx.outputLatency || 0,
          contextState: audioCtx.state,
          maxChannelCount: audioCtx.destination.maxChannelCount,
        };
        audioCtx.close();
      }
    } catch {
      // Audio Context not available
    }

    // Font Detection
    const baseFonts = ['serif', 'sans-serif', 'monospace'];
    const testFonts = [
      // System fonts
      'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier',
      'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma', 'Geneva', 'Lucida Console',
      'Lucida Sans Unicode', 'Monaco', 'Andale Mono', 'Symbol', 'Webdings', 'Wingdings',
      // Mac fonts
      'Apple Symbols', 'Avenir', 'Avenir Next', 'Chalkboard', 'Gill Sans', 'Helvetica Neue',
      'Hoefler Text', 'Lucida Grande', 'Marker Felt', 'Menlo', 'Optima', 'Palatino Linotype',
      // Windows fonts
      'Calibri', 'Cambria', 'Consolas', 'Constantia', 'Corbel', 'Franklin Gothic Medium',
      'Lucida Sans', 'Segoe UI', 'Segoe Print', 'Segoe Script', 'Segoe UI Light',
      // Linux fonts
      'Liberation Sans', 'Liberation Serif', 'Ubuntu', 'Droid Sans', 'Droid Serif',
      'DejaVu Sans', 'DejaVu Serif', 'FreeSans', 'FreeSerif',
    ];

    const availableFonts: string[] = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const canvasFont = document.createElement('canvas');
    const contextFont = canvasFont.getContext('2d');
    
    if (contextFont) {
      canvasFont.width = 100;
      canvasFont.height = 100;
      
      // Get baseline measurements
      const baselineWidths: Record<string, number> = {};
      baseFonts.forEach(baseFont => {
        contextFont.font = `${testSize} ${baseFont}`;
        baselineWidths[baseFont] = contextFont.measureText(testString).width;
      });

      // Test each font
      testFonts.forEach(font => {
        const isAvailable = baseFonts.some(baseFont => {
          contextFont.font = `${testSize} ${font}, ${baseFont}`;
          const width = contextFont.measureText(testString).width;
          return width !== baselineWidths[baseFont];
        });
        if (isAvailable) {
          availableFonts.push(font);
        }
      });
    }

    data.fonts = {
      available: availableFonts,
      count: availableFonts.length,
    };

    // Plugin Information
    if (navigator.plugins && navigator.plugins.length > 0) {
      const plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
      const mimeTypes = navigator.mimeTypes ? Array.from(navigator.mimeTypes).map(mime => mime.type) : [];
      
      data.plugins = {
        list: plugins,
        count: plugins.length,
        mimeTypes: mimeTypes,
      };
    }

    // Permissions
    if ('permissions' in navigator) {
      const permissionNames = ['notifications', 'geolocation', 'camera', 'microphone', 'midi', 'push', 'clipboard-read'];
      
      for (const permission of permissionNames) {
        try {
          const result = await navigator.permissions.query({ name: permission as PermissionName });
          data.permissions[permission as keyof typeof data.permissions] = result.state;
        } catch {
          // Permission not available
        }
      }
    }

    // Storage Quota
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        data.storage.quota = estimate.quota;
        data.storage.usage = estimate.usage;
      } catch {
        // Storage estimate not available
      }
    }

    // WebRTC Local IPs
    try {
      const localIPs: string[] = [];
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      
      pc.createDataChannel('');
      await pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
          if (match && !localIPs.includes(match[1])) {
            localIPs.push(match[1]);
          }
        }
      };

      // Give it some time to collect IPs
      setTimeout(() => {
        data.webrtc = {
          localIPs,
          stunSupport: true,
          turnSupport: 'RTCPeerConnection' in window,
          dtlsSupport: true,
        };
        pc.close();
      }, 1000);
    } catch {
      // WebRTC not available
    }

    // Count total data points
    const countDataPoints = (obj: Record<string, unknown>, prefix = ''): number => {
      let count = 0;
      for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            count += countDataPoints(obj[key] as Record<string, unknown>, `${prefix}${key}.`);
          } else {
            count++;
          }
        }
      }
      return count;
    };

    setCollectedDataPoints(countDataPoints(data as unknown as Record<string, unknown>));

    return data;
  };

  const loadBrowserData = useCallback(async () => {
    setLoading(true);
    const data = await collectComprehensiveBrowserData();
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
      basic: { level: 'CRITICAL', color: 'bg-red-100 text-red-800', description: 'Unique browser identification and OS detection' },
      screen: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Display fingerprinting for device identification' },
      datetime: { level: 'HIGH', color: 'bg-red-100 text-red-800', description: 'Geographic location and timezone inference' },
      webgl: { level: 'CRITICAL', color: 'bg-red-100 text-red-800', description: 'Unique hardware and driver fingerprinting' },
      canvas: { level: 'CRITICAL', color: 'bg-red-100 text-red-800', description: 'Highly persistent tracking fingerprint' },
      audio: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Audio hardware fingerprinting' },
      fonts: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Installed software and system profiling' },
      network: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Network conditions and ISP profiling' },
      hardware: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Device capabilities and performance profiling' },
      features: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Browser capabilities and version detection' },
      permissions: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'User behavior and security posture analysis' },
      storage: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Storage capacity and usage patterns' },
      performance: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Device performance characteristics' },
      plugins: { level: 'HIGH', color: 'bg-orange-100 text-orange-800', description: 'Installed software environment detection' },
      webrtc: { level: 'CRITICAL', color: 'bg-red-100 text-red-800', description: 'Real IP addresses behind VPN/proxy' },
      security: { level: 'MODERATE', color: 'bg-yellow-100 text-yellow-800', description: 'Security configuration assessment' },
    };
    return risks[category as keyof typeof risks] || { level: 'LOW', color: 'bg-green-100 text-green-800', description: 'Minimal privacy risk' };
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      basic: Globe,
      screen: Monitor,
      window: Monitor,
      datetime: Clock,
      network: Wifi,
      hardware: Cpu,
      webgl: Activity,
      canvas: Fingerprint,
      audio: Activity,
      fonts: Globe,
      plugins: HardDrive,
      webrtc: Navigation,
      storage: HardDrive,
      permissions: Lock,
      features: Zap,
      security: Shield,
      performance: Activity,
    };
    return icons[category as keyof typeof icons] || Info;
  };

  if (!browserData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Analyzing comprehensive browser data exposure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Academic Disclaimer */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-orange-900 mb-2">🎓 Academic Privacy Research Notice</h4>
              <p className="text-orange-800 mb-3">
                <strong>🔒 Your Privacy is Absolutely Protected:</strong> This comprehensive educational tool demonstrates 
                the extensive data that websites can automatically collect from your browser. 
                <strong> We do NOT collect, store, save, or transmit ANY of your personal information 
                to our servers or any third parties.</strong>
              </p>
              <div className="bg-orange-100 rounded-lg p-4 mb-3">
                <p className="text-sm text-orange-800 font-medium mb-2">📊 Data Collection Scope:</p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>✅ <strong>{collectedDataPoints}+ unique data points</strong> analyzed locally</li>
                  <li>✅ All processing happens <strong>entirely in your browser</strong></li>
                  <li>✅ Data is <strong>immediately discarded when you close this tab</strong></li>
                  <li>✅ <strong>No network requests</strong> - everything stays on your device</li>
                  <li>✅ <strong>No cookies, tracking, or persistent storage</strong> by PrivacyAnalyzer</li>
                  <li>✅ <strong>Open source code</strong> - verify our privacy claims</li>
                </ul>
              </div>
              <p className="text-sm text-orange-700">
                <strong>🎯 Educational Purpose:</strong> This tool reveals how websites can create a detailed 
                &quot;digital fingerprint&quot; of your device and browser, often more unique than your social security number. 
                Understanding this helps you make informed privacy decisions and take protective measures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsVisible(!isVisible)}
            className={`flex items-center gap-2 ${isVisible ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isVisible ? 'Hide Data Analysis' : 'Reveal Browser Data'}
          </Button>
          <Badge variant="outline" className="gap-2">
            <Info className="h-3 w-3" />
            {collectedDataPoints}+ Data Points Detected
          </Badge>
          <Badge variant="outline" className="gap-2 bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3" />
            Critical Privacy Exposure
          </Badge>
        </div>
        
        <Button
          variant="outline"
          onClick={loadBrowserData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      {isVisible && (
        <div className="space-y-6">
          {/* Data Categories Grid */}
          {Object.entries(browserData).map(([categoryKey, categoryData]) => {
            if (!categoryData || (Array.isArray(categoryData) && categoryData.length === 0)) return null;
            
            const risk = getRiskLevel(categoryKey);
            const IconComponent = getCategoryIcon(categoryKey);
            
            return (
              <Card key={categoryKey} className={`border-2 ${risk.color.includes('red') ? 'border-red-200' : risk.color.includes('orange') ? 'border-orange-200' : 'border-yellow-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${risk.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Information
                        </h3>
                        <p className="text-sm text-gray-600">{risk.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${risk.color} font-semibold`}>
                        {risk.level} RISK
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(categoryData, null, 2), categoryKey)}
                      >
                        {copiedItems.has(categoryKey) ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> : 
                          <Copy className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {typeof categoryData === 'object' && !Array.isArray(categoryData) ? (
                      Object.entries(categoryData).map(([key, value]) => (
                        <div key={key} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <div className="text-sm text-gray-600 mt-1 break-all">
                              {Array.isArray(value) ? (
                                value.length > 0 ? (
                                  <div className="space-y-1">
                                    {value.slice(0, 3).map((item, index) => (
                                      <div key={index} className="bg-white px-2 py-1 rounded text-xs">
                                        {String(item)}
                                      </div>
                                    ))}
                                    {value.length > 3 && (
                                      <div className="text-xs text-gray-500">
                                        ... and {value.length - 3} more
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  'None detected'
                                )
                              ) : (
                                String(value)
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : Array.isArray(categoryData) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {categoryData.slice(0, 20).map((item, index) => (
                          <div key={index} className="bg-white px-3 py-2 rounded border text-sm">
                            {String(item)}
                          </div>
                        ))}
                        {categoryData.length > 20 && (
                          <div className="text-sm text-gray-500 p-2">
                            ... and {categoryData.length - 20} more items
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{String(categoryData)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Enhanced Privacy Protection Tips */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Advanced Privacy Protection Strategies</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">🛡️ Browser Hardening</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use Firefox with strict privacy settings or Tor Browser for maximum anonymity</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Enable &quot;Resist Fingerprinting&quot; in Firefox (about:config → privacy.resistFingerprinting = true)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Disable JavaScript for sensitive browsing (NoScript extension)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use multiple browser profiles for different activities</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">🔒 Network Protection</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Always use VPN services to mask your real IP address</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT) for encrypted DNS</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Disable WebRTC to prevent IP leaks (chrome://flags/#disable-webrtc)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use HTTPS Everywhere and enable secure DNS settings</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">🛠️ Extension Arsenal</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>uBlock Origin (comprehensive ad and tracker blocking)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Privacy Badger (automatic tracker protection)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>ClearURLs (remove tracking parameters)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Canvas Blocker (prevent canvas fingerprinting)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">⚡ Advanced Techniques</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Regularly clear cookies, cache, and browser data</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Use virtual machines for highly sensitive activities</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Consider Qubes OS or Tails for maximum security</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p>Randomize your digital fingerprint with tools like Chameleon extension</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fingerprint Uniqueness Warning */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-800 mb-2">⚠️ Your Digital Fingerprint Uniqueness</h5>
                    <p className="text-sm text-red-700">
                      Based on the {collectedDataPoints}+ data points collected, your browser fingerprint is likely 
                      <strong> more unique than 1 in 100,000 users</strong>. This means you can be reliably tracked 
                      across websites even without cookies. The combination of your screen resolution, installed fonts, 
                      hardware capabilities, and browser features creates a digital signature that&apos;s virtually impossible to duplicate.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}