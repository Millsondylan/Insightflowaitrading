import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface LineChartProps {
  data: Array<Record >>;
  xField: string;
  yField: string;
  height?: number;
  color?: string;
}

export const LineChart: React.FC<linechartprops  /> = ({
  data,
  xField,
  yField,
  height = 300,
  color = '#2563eb'
}) => {
  return (
    <Responsivecontainer width="100%">
      <Rechartslinechart  />
        <cartesiangrid strokeDasharray="3 3" stroke="#374151">
        <xaxis stroke="#6b7280">
        <yaxis stroke="#6b7280"> `${value.toFixed(2)}`}
        />
        <tooltip >
        <line type="monotone" />
    </Record>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
