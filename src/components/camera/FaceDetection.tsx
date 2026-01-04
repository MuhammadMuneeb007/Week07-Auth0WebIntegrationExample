"use client";

import { useEffect, useRef, useState } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
}

interface FramingGuidance {
  message: string;
  type: 'success' | 'warning' | 'info';
}

export default function FaceDetection({ videoRef, isActive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<FaceDetector | null>(null);
  const [loading, setLoading] = useState(true);
  const [fps, setFps] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [guidance, setGuidance] = useState<FramingGuidance | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<number>(0);

  useEffect(() => {
    const loadDetector = async () => {
      try {
        setLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
          },
          runningMode: "VIDEO"
        });
        
        setDetector(faceDetector);
        setLoading(false);
      } catch (error) {
        console.error('Error loading face detector:', error);
        setLoading(false);
      }
    };

    loadDetector();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!detector || !videoRef.current || !canvasRef.current || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    let lastVideoTime = -1;

    const detect = () => {
      if (video.readyState === 4) {
        const now = performance.now();
        
        // Calculate FPS
        if (lastTimeRef.current) {
          fpsCounterRef.current++;
          if (now - lastTimeRef.current >= 1000) {
            setFps(fpsCounterRef.current);
            fpsCounterRef.current = 0;
            lastTimeRef.current = now;
          }
        } else {
          lastTimeRef.current = now;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Only detect if we have a new frame
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          
          const detections = detector.detectForVideo(video, performance.now());
          
          setFaceCount(detections.detections.length);

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Analyze and provide guidance
          if (detections.detections.length === 0) {
            setGuidance({ message: 'No face detected', type: 'warning' });
          } else if (detections.detections.length > 1) {
            setGuidance({ message: 'Multiple faces detected', type: 'info' });
          } else {
            const detection = detections.detections[0];
            const bbox = detection.boundingBox;
            
            if (bbox) {
              const faceWidth = bbox.width;
              const faceHeight = bbox.height;
              const centerX = bbox.originX + bbox.width / 2;
              const centerY = bbox.originY + bbox.height / 2;
              const canvasCenterX = canvas.width / 2;
              const canvasCenterY = canvas.height / 2;

              // Draw bounding box
              ctx.strokeStyle = '#00ff00';
              ctx.lineWidth = 3;
              ctx.strokeRect(bbox.originX, bbox.originY, bbox.width, bbox.height);

              // Draw landmarks if available
              if (detection.keypoints) {
                detection.keypoints.forEach(keypoint => {
                  ctx.fillStyle = '#ff0000';
                  ctx.beginPath();
                  ctx.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
                  ctx.fill();
                });
              }

              // Provide framing guidance
              const offsetX = Math.abs(centerX - canvasCenterX);
              const offsetY = Math.abs(centerY - canvasCenterY);
              const faceSize = (faceWidth + faceHeight) / 2;
              const optimalSize = canvas.width * 0.3;

              if (faceSize < optimalSize * 0.7) {
                setGuidance({ message: '← Move closer', type: 'info' });
              } else if (faceSize > optimalSize * 1.3) {
                setGuidance({ message: 'Move back →', type: 'info' });
              } else if (offsetX > canvas.width * 0.1) {
                setGuidance({ 
                  message: centerX < canvasCenterX ? 'Move right →' : '← Move left', 
                  type: 'info' 
                });
              } else if (offsetY > canvas.height * 0.1) {
                setGuidance({ 
                  message: centerY < canvasCenterY ? 'Move down ↓' : '↑ Move up', 
                  type: 'info' 
                });
              } else {
                setGuidance({ message: '✓ Perfect framing!', type: 'success' });
              }

              // Draw center guide
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(canvasCenterX, canvasCenterY, optimalSize / 2, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }
        }
      }

      // Throttle to ~10 FPS
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(detect);
      }, 100);
    };

    detect();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [detector, videoRef, isActive]);

  if (loading) {
    return (
      <div className="detection-overlay">
        <div className="detection-loading">
          <div className="spinner"></div>
          <p>Loading Face Detection Model...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} className="detection-canvas" />
      
      <div className="detection-info face-detection">
        <div className="info-header">
          <span className="fps-counter">FPS: {fps}</span>
          <span className="face-count">Faces: {faceCount}</span>
        </div>
        
        {guidance && (
          <div className={`guidance-message guidance-${guidance.type}`}>
            {guidance.message}
          </div>
        )}

        <div className="guidance-notes">
          <h4>Framing Tips</h4>
          <ul>
            <li>✓ Face the camera directly</li>
            <li>✓ Ensure good lighting</li>
            <li>✓ Keep face centered in the circle</li>
            <li>✓ Maintain steady position</li>
          </ul>
        </div>
      </div>
    </>
  );
}
