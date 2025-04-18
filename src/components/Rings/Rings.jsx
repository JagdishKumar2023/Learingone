import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  interpolateColor,
  useAnimatedProps,
} from 'react-native-reanimated';
import {Circle, Svg} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Rings = ({ringsColors, setMetaData}) => {
  const strokeWidth = 5;
  const gap = 5;
  const radius1 = 35; // Outer circle
  const radius2 = radius1 - strokeWidth - gap; // Middle circle
  const radius3 = radius2 - strokeWidth - gap; // Inner circle
  const circumference1 = 2 * Math.PI * radius1;
  const circumference2 = 2 * Math.PI * radius2;
  const circumference3 = 2 * Math.PI * radius3;
  const duration1 = 50000; // Animation duration
  const duration2 = 50000; // Animation duration
  const duration3 = 50000; // Animation duration

  const strokeOffset1 = useSharedValue(circumference1);
  const strokeOffset2 = useSharedValue(circumference2);
  const strokeOffset3 = useSharedValue(circumference3);

  useEffect(() => {
    strokeOffset1.value = withTiming(0, {duration: duration1});
    strokeOffset2.value = withTiming(0, {duration: duration2});
    strokeOffset3.value = withTiming(0, {duration: duration3});
  }, []);

  const percentage1 = useDerivedValue(
    () => ((circumference1 - strokeOffset1.value) / circumference1) * 100,
  );

  const percentage2 = useDerivedValue(
    () => ((circumference2 - strokeOffset2.value) / circumference2) * 100,
  );

  const percentage3 = useDerivedValue(
    () => ((circumference3 - strokeOffset3.value) / circumference3) * 100,
  );

  const strokeColor1 = useDerivedValue(() =>
    interpolateColor(percentage1.value, [0, 50, 100], ringsColors.stroke1),
  );

  const strokeColor2 = useDerivedValue(() =>
    interpolateColor(percentage2.value, [0, 50, 100], ringsColors.stroke2),
  );

  const strokeColor3 = useDerivedValue(() =>
    interpolateColor(percentage3.value, [0, 50, 100], ringsColors.stroke3),
  );

  // Animated properties for each circle
  const animatedProps1 = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset1.value,
    stroke: strokeColor1.value,
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset2.value,
    stroke: strokeColor2.value,
  }));

  const animatedProps3 = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset3.value,
    stroke: strokeColor3.value,
  }));

  return (
    <Svg height="158" width="158" viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r={radius1}
        stroke="#E7E7E7"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <Circle
        cx="50"
        cy="50"
        r={radius2}
        stroke="#E7E7E7"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <Circle
        cx="50"
        cy="50"
        r={radius3}
        stroke="#E7E7E7"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <AnimatedCircle
        cx="50"
        cy="50"
        r={radius1}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference1}
        animatedProps={animatedProps1}
        strokeLinecap="round"
      />
      <AnimatedCircle
        cx="50"
        cy="50"
        r={radius2}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference2}
        animatedProps={animatedProps2}
        strokeLinecap="round"
      />
      <AnimatedCircle
        cx="50"
        cy="50"
        r={radius3}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference3}
        animatedProps={animatedProps3}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Rings;
