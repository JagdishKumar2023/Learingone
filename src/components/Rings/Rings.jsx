import React from 'react';
import { Circle, Svg } from 'react-native-svg';

const Rings = ({ringsColors, setMetaData}) => {
  const strokeWidth = 5;
  const gap = 5;
  const radius1 = 35; // Outer circle
  const radius2 = radius1 - strokeWidth - gap; // Middle circle
  const radius3 = radius2 - strokeWidth - gap; // Inner circle
  // Static color definitions
  const strokeColor1 = ringsColors.stroke1[0];
  const strokeColor2 = ringsColors.stroke2[0];
  const strokeColor3 = ringsColors.stroke3[0];

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
      <Circle
        cx="50"
        cy="50"
        r={radius1}
        strokeWidth={strokeWidth}
        stroke={strokeColor1}
        fill="transparent"
      />
      <Circle
        cx="50"
        cy="50"
        r={radius2}
        strokeWidth={strokeWidth}
        stroke={strokeColor2}
        fill="transparent"
      />
      <Circle
        cx="50"
        cy="50"
        r={radius3}
        strokeWidth={strokeWidth}
        stroke={strokeColor3}
        fill="transparent"
      />
    </Svg>
  );
};

export default Rings;