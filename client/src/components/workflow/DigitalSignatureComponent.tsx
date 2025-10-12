// Digital signature component
import React, { useState, useRef } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Pen, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

interface DigitalSignatureComponentProps {
  documentId: string;
  onSignatureComplete: (signature: any) => void;
}

export const DigitalSignatureComponent: React.FC<DigitalSignatureComponentProps> = ({
  documentId,
  onSignatureComplete
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addSignature, verifySignature, signatures } = useWorkflow();

  const documentSignatures = signatures.filter(sig => sig.documentId === documentId);

  const startSigning = () => {
    setIsSigning(true);
    setError('');
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    if (!isSigning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL();
    setSignature(signatureData);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setIsVerified(false);
  };

  const saveSignature = async () => {
    if (!signature.trim()) {
      setError('Please provide a signature');
      return;
    }

    try {
      const newSignature = await addSignature(documentId, signature);
      setIsVerified(true);
      onSignatureComplete(newSignature);
      setError('');
    } catch (err) {
      setError('Failed to save signature');
    }
  };

  const verifyExistingSignature = async (signatureId: string) => {
    try {
      const verified = await verifySignature(signatureId);
      if (verified) {
        setIsVerified(true);
      }
    } catch (err) {
      setError('Failed to verify signature');
    }
  };

  const getSignatureStatus = (sig: any) => {
    if (sig.verified) {
      return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Verified', color: 'bg-green-100 text-green-800' };
    } else {
      return { icon: <Clock className="h-4 w-4 text-yellow-600" />, text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Digital Signature
        </CardTitle>
        <CardDescription>
          Sign this document digitally with legal validity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Existing Signatures */}
        {documentSignatures.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Existing Signatures</h4>
            {documentSignatures.map(sig => {
              const status = getSignatureStatus(sig);
              return (
                <div key={sig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {status.icon}
                    <div>
                      <p className="font-medium text-sm">Signature #{sig.id.slice(-4)}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(sig.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                    {!sig.verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => verifyExistingSignature(sig.id)}
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Signature Canvas */}
        {isSigning && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border border-gray-200 rounded cursor-crosshair"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={saveSignature} disabled={!signature}>
                <Pen className="h-4 w-4 mr-2" />
                Save Signature
              </Button>
              <Button variant="outline" onClick={clearSignature}>
                Clear
              </Button>
              <Button variant="outline" onClick={() => setIsSigning(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Start Signing Button */}
        {!isSigning && (
          <div className="text-center">
            <Button onClick={startSigning} size="lg">
              <Pen className="h-5 w-5 mr-2" />
              Start Digital Signature
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Click to begin signing this document
            </p>
          </div>
        )}

        {/* Signature Success */}
        {isVerified && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Signature saved successfully and verified!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
