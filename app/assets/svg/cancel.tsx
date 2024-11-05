import React from 'react';
import Svg, { Line } from 'react-native-svg';

interface CancelProps {
  width?: number;
  height?: number;
  color?: string;
}

const Cancel: React.FC<CancelProps> = ({
  width = 32,
  height = 32,
  color = '#000000',
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Line
      x1="7"
      x2="25"
      y1="7"
      y2="25"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="7"
      x2="25"
      y1="25"
      y2="7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Cancel;
