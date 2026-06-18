import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertTriangle, ScanLine, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { wasteTypeInfo, type WasteType } from '../lib/data';
import { toast } from 'sonner';

interface ScanResult {
  wasteType: WasteType;
  confidence: number;
  disposalNote: string;
  hazardLevel: 'low' | 'medium' | 'high';
}

// Simulate AI waste classification from a captured image
function simulateScan(): Promise<ScanResult> {
  const results: ScanResult[] = [
    { wasteType: 'battery', confidence: 94, disposalNote: 'Keep terminals taped. Do not puncture or incinerate.', hazardLevel: 'medium' },
    { wasteType: 'electronics', confidence: 88, disposalNote: 'Remove personal data before disposal. Handle with care.', hazardLevel: 'low' },
    { wasteType: 'chemicals', confidence: 91, disposalNote: 'Keep in original sealed container. Do NOT mix with other chemicals.', hazardLevel: 'high' },
    { wasteType: 'paint', confidence: 85, disposalNote: 'Solidify latex paint before disposal. Store away from heat.', hazardLevel: 'low' },
    { wasteType: 'medical', confidence: 97, disposalNote: 'Use sharps container for needles. Seal all biohazard bags.', hazardLevel: 'high' },
    { wasteType: 'oil', confidence: 90, disposalNote: 'Store in sealed leak-proof container. Never pour down drain.', hazardLevel: 'medium' },
  ];
  return new Promise(resolve => setTimeout(() => resolve(results[Math.floor(Math.random() * results.length)]), 2200));
}

interface WasteScannerProps {
  open: boolean;
  onClose: () => void;
  onResult?: (wasteType: WasteType) => void;
}

type ScanState = 'idle' | 'streaming' | 'scanning' | 'result' | 'error';

export function WasteScanner({ open, onClose, onResult }: WasteScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setScanState('idle');
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanState('streaming');
    } catch (err: any) {
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access.'
        : 'Could not access camera. Make sure no other app is using it.');
      setScanState('error');
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopStream();
      setScanState('idle');
      setScanResult(null);
    }
    return () => stopStream();
  }, [open, startCamera, stopStream]);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setScanState('scanning');

    // Capture frame to canvas
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);

    try {
      const result = await simulateScan();
      setScanResult(result);
      setScanState('result');
    } catch {
      setScanState('error');
      setCameraError('Scan failed. Please try again.');
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    startCamera();
  };

  const handleToggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleUseResult = () => {
    if (scanResult) {
      onResult?.(scanResult.wasteType);
      toast.success(`${wasteTypeInfo[scanResult.wasteType].name} identified`, {
        description: 'Waste type pre-filled in your request form.',
      });
      onClose();
    }
  };

  const hazardColors = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            Waste Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          {/* Camera feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{ display: scanState === 'result' ? 'none' : 'block' }}
          />

          {/* Canvas for capture preview */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{ display: scanState === 'result' ? 'block' : 'none' }}
          />

          {/* Scan overlay frame */}
          {scanState === 'streaming' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-48">
                {/* Corner marks */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
                  <div
                    key={corner}
                    className="absolute w-8 h-8 border-emerald-400"
                    style={{
                      borderWidth: 3,
                      ...(corner.includes('top') ? { top: 0 } : { bottom: 0 }),
                      ...(corner.includes('left') ? { left: 0 } : { right: 0 }),
                      borderTopWidth: corner.includes('top') ? 3 : 0,
                      borderBottomWidth: corner.includes('bottom') ? 3 : 0,
                      borderLeftWidth: corner.includes('left') ? 3 : 0,
                      borderRightWidth: corner.includes('right') ? 3 : 0,
                      borderStyle: 'solid',
                      borderRadius: corner.includes('top-left') ? '4px 0 0 0' :
                        corner.includes('top-right') ? '0 4px 0 0' :
                        corner.includes('bottom-left') ? '0 0 0 4px' : '0 0 4px 0',
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-6 h-6 text-emerald-400 opacity-70" />
                </div>
              </div>
              <p className="absolute bottom-4 left-0 right-0 text-center text-white text-xs opacity-80">
                Point at hazardous waste item
              </p>
            </div>
          )}

          {/* Scanning animation */}
          {scanState === 'scanning' && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <p className="text-white text-sm">Analyzing waste type…</p>
              {/* Animated scan line */}
              <div className="absolute inset-x-8 h-0.5 bg-emerald-400 opacity-80 animate-bounce" style={{ top: '50%' }} />
            </div>
          )}

          {/* Error state */}
          {scanState === 'error' && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-3 p-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
              <p className="text-white text-center text-sm">{cameraError}</p>
              <Button onClick={startCamera} variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Result panel */}
        {scanState === 'result' && scanResult && (
          <div className="p-4 space-y-3 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold">Item Identified</span>
              </div>
              <Badge className="bg-slate-100 text-slate-700">{scanResult.confidence}% confident</Badge>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-3xl">{wasteTypeInfo[scanResult.wasteType].icon}</span>
              <div>
                <p className="font-semibold">{wasteTypeInfo[scanResult.wasteType].name}</p>
                <Badge className={`text-xs border ${hazardColors[scanResult.hazardLevel]}`}>
                  {scanResult.hazardLevel.toUpperCase()} hazard
                </Badge>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <p className="font-medium text-amber-800 mb-1">⚠️ Disposal Instructions</p>
              <p className="text-amber-700">{scanResult.disposalNote}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Again
              </Button>
              <Button onClick={handleUseResult} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Use in Request
              </Button>
            </div>
          </div>
        )}

        {/* Action bar when streaming */}
        {scanState === 'streaming' && (
          <div className="p-4 flex items-center justify-between border-t">
            <Button variant="outline" size="icon" onClick={handleToggleCamera} title="Flip camera">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 px-8"
              onClick={handleScan}
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Scan Item
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
