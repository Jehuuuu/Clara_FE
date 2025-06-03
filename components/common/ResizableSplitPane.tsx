"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface ResizableSplitPaneProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  defaultSplit?: number; // Percentage for left pane (0-100)
  minSize?: number; // Minimum width in pixels for each pane
  maxSize?: number; // Maximum width in pixels for left pane
  split?: 'vertical' | 'horizontal';
  className?: string;
}

export function ResizableSplitPane({
  leftPane,
  rightPane,
  defaultSplit = 60, // Default: 60% left, 40% right
  minSize = 300,
  maxSize = 1000,
  split = 'vertical',
  className = ''
}: ResizableSplitPaneProps) {
  const [splitPercentage, setSplitPercentage] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on resizer
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  // Handle mouse move during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate new position relative to container
      const newLeftWidth = e.clientX - containerRect.left;
      const newPercentage = (newLeftWidth / containerWidth) * 100;
      
      // Apply constraints
      const minPercentage = (minSize / containerWidth) * 100;
      const maxPercentage = Math.min((maxSize / containerWidth) * 100, 100 - minPercentage);
      
      const constrainedPercentage = Math.max(minPercentage, Math.min(maxPercentage, newPercentage));
      
      setSplitPercentage(constrainedPercentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minSize, maxSize]);

  return (
    <div 
      ref={containerRef}
      className={`resizable-split-pane ${className}`}
      style={{ display: 'flex', height: '100%', overflow: 'hidden' }}
    >
      {/* Left Pane */}
      <div 
        className="split-pane-left"
        style={{ 
          width: `${splitPercentage}%`, 
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'width 0.1s ease'
        }}
      >
        {leftPane}
      </div>
      
      {/* Resizer Handle */}
      <div
        ref={resizerRef}
        className={`split-pane-resizer ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        style={{
          width: '6px',
          backgroundColor: isDragging ? '#3b82f6' : 'transparent',
          cursor: 'col-resize',
          flexShrink: 0,
          position: 'relative',
          transition: 'background-color 0.2s ease'
        }}
      >
        {/* Invisible wider hit area for easier dragging */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-6px',
            right: '-6px',
            bottom: 0,
            cursor: 'col-resize'
          }}
        />
        
        {/* Visual indicator */}
        <div
          className="resizer-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2px',
            height: '30px',
            backgroundColor: isDragging ? '#ffffff' : '#6b7280',
            borderRadius: '1px',
            opacity: isDragging ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
      </div>
      
      {/* Right Pane */}
      <div 
        className="split-pane-right"
        style={{ 
          width: `${100 - splitPercentage}%`, 
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'width 0.1s ease'
        }}
      >
        {rightPane}
      </div>
    </div>
  );
} 