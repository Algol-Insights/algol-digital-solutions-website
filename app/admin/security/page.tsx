'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui-lib/button';
import { Input } from '@/components/ui-lib/input';
import { Card } from '@/components/ui-lib/card';
import { Shield, ShieldCheck, ShieldOff } from 'lucide-react';

export default function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/admin/2fa/status');
      const data = await response.json();
      setEnabled(data.enabled);
    } catch (error) {
      console.error('Failed to check 2FA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/2fa/setup', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setShowSetup(true);
    } catch (error) {
      setError('Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!token) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid token');
      }

      setSuccess('2FA enabled successfully!');
      setEnabled(true);
      setShowSetup(false);
      setQrCode('');
      setSecret('');
      setToken('');
    } catch (error: any) {
      setError(error.message || 'Failed to verify token');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!token) {
      setError('Please enter your current 2FA code to disable');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      setSuccess('2FA disabled successfully');
      setEnabled(false);
      setToken('');
    } catch (error: any) {
      setError(error.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showSetup) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 animate-pulse" />
          <span>Loading 2FA settings...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {enabled ? (
                <ShieldCheck className="w-8 h-8 text-green-600" />
              ) : (
                <ShieldOff className="w-8 h-8 text-gray-400" />
              )}
              <div>
                <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600">
                  {enabled ? (
                    <span className="text-green-600">Enabled - Your account is protected</span>
                  ) : (
                    <span>Not enabled - Add an extra layer of security</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Setup Flow */}
      {!enabled && !showSetup && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Enable Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-6">
            Protect your admin account with an additional security layer. You'll need an authenticator app like Google Authenticator or Authy.
          </p>
          <Button onClick={startSetup} disabled={loading}>
            <Shield className="w-4 h-4 mr-2" />
            Enable 2FA
          </Button>
        </Card>
      )}

      {/* QR Code Setup */}
      {showSetup && qrCode && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <img src={qrCode} alt="QR Code" className="w-64 h-64 border rounded-lg" />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
                <code className="bg-gray-100 px-4 py-2 rounded text-sm font-mono">
                  {secret}
                </code>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter 6-digit code from your authenticator app
                </label>
                <Input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={verifyAndEnable}
                  disabled={loading || token.length !== 6}
                  className="flex-1"
                >
                  Verify and Enable
                </Button>
                <Button
                  onClick={() => {
                    setShowSetup(false);
                    setQrCode('');
                    setSecret('');
                    setToken('');
                  }}
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Disable 2FA */}
      {enabled && (
        <Card className="p-6 border-red-200">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Disable Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-4">
            Disabling 2FA will make your account less secure. Enter your current 2FA code to confirm.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="max-w-xs"
            />
            <Button
              onClick={disable2FA}
              variant="destructive"
              disabled={loading || token.length !== 6}
            >
              Disable 2FA
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
