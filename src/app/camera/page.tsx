// CLEANED UP - Removed duplicate gradient background, now uses shared Spline background
// Added Navigation component for consistency

"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import SplineBackground from '@/components/SplineBackground';
import Navigation from '@/components/Navigation';

// Dynamic import for heavy detection components
const ObjectDetection = dynamic(() => import('@/components/camera/ObjectDetection'), {
  ssr: false,
  loading: () => <div className="loading-detection">Loading Object Detection...</div>
});

const FaceDetection = dynamic(() => import('@/components/camera/FaceDetection'), {
  ssr: false,
  loading: () => <div className="loading-detection">Loading Face Detection...</div>
});

type DetectionMode = 'object' | 'face';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [detectionMode, setDetectionMode] = useState<DetectionMode>('object');
  const [error, setError] = useState<string>('');
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  const startCamera = async () => {
    try {
      // Check if running in browser and getUserMedia is supported
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser. Please use Chrome, Firefox, or Edge.');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: selectedCamera 
          ? { deviceId: { exact: selectedCamera }, width: 1280, height: 720 }
          : { width: 1280, height: 720, facingMode: 'user' }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsActive(true);
      setError('');
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setSnapshots(prev => [imageData, ...prev].slice(0, 6)); // Keep last 6
      }
    }
  };

  useEffect(() => {
    // Enumerate available cameras
    const getCameras = async () => {
      try {
        if (typeof window !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setCameras(videoDevices);
          if (videoDevices.length > 0 && !selectedCamera) {
            setSelectedCamera(videoDevices[0].deviceId);
          }
        }
      } catch (err) {
        console.error('Error enumerating cameras:', err);
      }
    };
    getCameras();
  }, [selectedCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <>
      <SplineBackground />
      <Navigation />
      
      <div className="camera-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="camera-container"
        >
        <h1 className="camera-title">Camera Detection Tool</h1>
        
        <div className="camera-controls">
          <div className="control-group">
            <label>Camera:</label>
            <select 
              value={selectedCamera} 
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="mode-selector"
              disabled={isActive}
            >
              {cameras.map((camera, idx) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Detection Mode:</label>
            <select 
              value={detectionMode} 
              onChange={(e) => setDetectionMode(e.target.value as DetectionMode)}
              className="mode-selector"
              disabled={isActive}
            >
              <option value="object">Object Detection</option>
              <option value="face">Face Detection</option>
            </select>
          </div>

          <div className="control-buttons">
            {!isActive ? (
              <button onClick={startCamera} className="btn btn-start">
                ▶ Start Camera
              </button>
            ) : (
              <>
                <button onClick={stopCamera} className="btn btn-stop">
                  ⏹ Stop Camera
                </button>
                <button onClick={captureSnapshot} className="btn btn-snapshot">
                  📸 Snapshot
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <div className="video-section">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-feed"
            />
            
            {isActive && detectionMode === 'object' && (
              <ObjectDetection videoRef={videoRef} isActive={isActive} />
            )}
            
            {isActive && detectionMode === 'face' && (
              <FaceDetection videoRef={videoRef} isActive={isActive} />
            )}
          </div>

          {snapshots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="snapshots-gallery"
            >
              <h3>Snapshots ({snapshots.length})</h3>
              <div className="snapshots-grid">
                {snapshots.map((snapshot, idx) => (
                  <motion.img
                    key={idx}
                    src={snapshot}
                    alt={`Snapshot ${idx + 1}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="snapshot-thumb"
                  />
                ))}
              </div>
              <button 
                onClick={() => setSnapshots([])} 
                className="btn btn-clear"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
    </>
  );
}
