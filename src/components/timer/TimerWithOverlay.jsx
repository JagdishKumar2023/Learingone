import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

// Ultra-simplified version that only handles overlay display with hardware acceleration
export default function TimerWithOverlay({ 
  duration, 
  isActive,
  isSelected = false,
  remainingSeconds,
  showLastFiveSecondsOverlay = false
}) {
  // Core timer state
  const [remaining, setRemaining] = useState(duration);
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Use hardware-accelerated opacity animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Refs for stable state tracking and race condition prevention
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const inLastFiveSecondsRef = useRef(false);
  
  // Reset on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Handle overlay visibility changes with hardware acceleration - IMMEDIATE RESPONSE
  useEffect(() => {
    // Simple direct animation - no complex logic
    if (showLastFiveSecondsOverlay) {
      // Force immediate update for overlay state
      setShowOverlay(true);
      inLastFiveSecondsRef.current = true;
      
      // Hardware accelerated fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100, // Faster animation for more responsive feel
        useNativeDriver: true, // Critical for performance
      }).start();
    } else {
      // Hardware accelerated fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true, // Critical for performance
      }).start(() => {
        // Only update state after animation completes to prevent flickering
        setShowOverlay(false);
        inLastFiveSecondsRef.current = false;
      });
    }
  }, [showLastFiveSecondsOverlay, fadeAnim]);
  
  // Main timer effect with proper cleanup
  useEffect(() => {
    // Don't run internal timer if we're getting time from parent
    if (remainingSeconds !== undefined) {
      setRemaining(remainingSeconds);
      return;
    }
    
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
    
    // Don't show overlay at timer start
    setShowOverlay(false);
    inLastFiveSecondsRef.current = false;
    
    // Start new interval - update more frequently for smoother display
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
    }, 500); // Update twice per second for smoother countdown
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, duration, isSelected, remainingSeconds]); 
  
  // Format time
  const min = String(Math.floor(remaining / 60)).padStart(2, '0');
  const sec = String(remaining % 60).padStart(2, '0');
  
  // Render component with hardware-accelerated animation
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 150,
    marginVertical: 5,
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    borderRadius: 8,
  }
});