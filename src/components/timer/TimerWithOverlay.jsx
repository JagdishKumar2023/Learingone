import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimerWithOverlay({ duration, isActive, isSelected = false }) {
  // Core timer state
  const [remaining, setRemaining] = useState(duration);
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Refs for stable state tracking and race condition prevention
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const inLastFiveSecondsRef = useRef(false);
  
  // Add state to prevent overlay on first render
  const [initialized, setInitialized] = useState(false);
  
  // Reset completely when duration changes or component unmounts
  useEffect(() => {
    // Reset state on mount and when duration changes
    setRemaining(duration);
    setShowOverlay(false);
    inLastFiveSecondsRef.current = false;
    
    return () => {
      // Mark unmounted to prevent setState on unmounted component
      mountedRef.current = false;
    };
  }, [duration]);
  
  // Handle selection changes
  useEffect(() => {
    // Hide overlay when this timer is not selected
    if (!isSelected && showOverlay) {
      setShowOverlay(false);
      inLastFiveSecondsRef.current = false;
    }
  }, [isSelected, showOverlay]);
  
  // Main timer effect with proper cleanup
  useEffect(() => {
    // Clear any existing timer first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Don't run timer if not active
    if (!isActive) {
      setRemaining(duration);
      setShowOverlay(false);
      inLastFiveSecondsRef.current = false;
      return;
    }
    
    // Reset state at timer start
    setRemaining(duration);
    
    // Don't show overlay at timer start, regardless of remaining time
    setShowOverlay(false);
    inLastFiveSecondsRef.current = false;
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      if (!mountedRef.current) return;
      
      setRemaining(prevRemaining => {
        const nextRemaining = prevRemaining - 1;
        
        // Timer complete
        if (nextRemaining <= 0) {
          // Clean up interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Reset states
          if (mountedRef.current) {
            inLastFiveSecondsRef.current = false;
            setShowOverlay(false);
          }
          
          return duration;
        }
        
        // Last 5 seconds detection - only if selected
        if (isSelected && nextRemaining <= 5 && nextRemaining > 0) {
          // Only update state if not already in last 5 seconds (prevent flicker)
          if (!inLastFiveSecondsRef.current) {
            inLastFiveSecondsRef.current = true;
            if (mountedRef.current) {
              setShowOverlay(true);
            }
          }
        } else if (inLastFiveSecondsRef.current) {
          // Exited last 5 seconds or no longer selected
          inLastFiveSecondsRef.current = false;
          if (mountedRef.current) {
            setShowOverlay(false);
          }
        }
        
        return nextRemaining;
      });
    }, 1000);
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, duration, isSelected]); // Include isSelected in dependencies
  
  // Initialize component with no overlay
  useEffect(() => {
    // Set initialized after a delay
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Don't show overlay on first render
  const shouldShowOverlay = initialized && showOverlay;
  
  // Format time
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  
  // Render component
  return (
    <View style={styles.container}>
      {/* Only render overlay if explicitly shown AND after initialization */}
      {shouldShowOverlay && (
        <View style={styles.overlay} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  timerBox: { margin: 10, padding: 20, backgroundColor: '#333', borderRadius: 12, alignItems: 'center', minWidth: 120 },
  timerLabel: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  overlayText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
});