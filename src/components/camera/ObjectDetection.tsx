"use client";

import { useEffect, useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
}

interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}

export default function ObjectDetection({ videoRef, isActive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<number>(0);

  // Available COCO-SSD classes
  const commonClasses = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'bottle', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich',
    'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
    'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book',
    'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
  ];

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        console.error('Error loading COCO-SSD model:', error);
        setLoading(false);
      }
    };

    loadModel();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current || !canvasRef.current || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const detect = async () => {
      if (video.readyState === 4) {
        // Calculate FPS
        const now = performance.now();
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

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Run detection
        const predictions = await model.detect(video);
        
        // Filter predictions based on selected filter
        const filtered = selectedFilter === 'all' 
          ? predictions 
          : predictions.filter(p => p.class === selectedFilter);

        setDetections(filtered as Detection[]);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bounding boxes
        filtered.forEach((prediction: any) => {
          const [x, y, width, height] = prediction.bbox;

          // Draw box
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          // Draw label background
          const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
          ctx.font = '16px Inter, sans-serif';
          const textWidth = ctx.measureText(label).width;
          
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          ctx.fillRect(x, y - 25, textWidth + 10, 25);

          // Draw label text
          ctx.fillStyle = '#000';
          ctx.fillText(label, x + 5, y - 7);
        });
      }

      // Throttle to ~10 FPS for performance
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
  }, [model, videoRef, isActive, selectedFilter]);

  if (loading) {
    return (
      <div className="detection-overlay">
        <div className="detection-loading">
          <div className="spinner"></div>
          <p>Loading Object Detection Model...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} className="detection-canvas" />
      
      <div className="detection-info">
        <div className="info-header">
          <span className="fps-counter">FPS: {fps}</span>
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Objects</option>
            {commonClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="detections-list">
          <h4>Detected Objects ({detections.length})</h4>
          {detections.length === 0 ? (
            <p className="no-detections">No objects detected</p>
          ) : (
            <ul>
              {detections.map((det, idx) => (
                <li key={idx} className="detection-item">
                  <span className="detection-class">{det.class}</span>
                  <span className="detection-confidence">
                    {Math.round(det.score * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
