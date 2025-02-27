import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const CustomCircularProgress = ({
  value = 100,
  radius = 55,
  progressValueColor = '#ecf0f1',
  activeStrokeColor = 'red',
  inActiveStrokeColor = '#9b59b6',
  inActiveStrokeOpacity = 0.5,
  inActiveStrokeWidth = 20,
  activeStrokeWidth = 15,
  duration = 20000,
}) => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setStartAnimation(true), 200);
  }, []);

  return (
    <View>
      <CircularProgress
        value={startAnimation ? value : 0}
        radius={radius}
        progressValueColor={progressValueColor}
        activeStrokeColor={activeStrokeColor}
        inActiveStrokeColor={inActiveStrokeColor}
        inActiveStrokeOpacity={inActiveStrokeOpacity}
        inActiveStrokeWidth={inActiveStrokeWidth}
        activeStrokeWidth={activeStrokeWidth}
        duration={duration}
      />
    </View>
  );
};

export default CustomCircularProgress;
