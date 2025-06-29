
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ChartData {
  chartConfig: {
    type: 'bar' | 'line' | 'pie' | 'scatter';
    title: string;
    xAxis?: { dataKey: string; label: string };
    yAxis?: { label: string };
    series: Array<{ dataKey: string; name: string; stroke: string }>;
  };
  data: Array<Record<string, any>>;
}

interface ChartRendererProps {
  chartData: ChartData;
}

const ChartRenderer = ({ chartData }: ChartRendererProps) => {
  const { chartConfig, data } = chartData;

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderChart = () => {
    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis?.dataKey} 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {chartConfig.series.map((series, index) => (
                <Bar 
                  key={index}
                  dataKey={series.dataKey} 
                  name={series.name}
                  fill={series.stroke}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis?.dataKey} 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {chartConfig.series.map((series, index) => (
                <Line 
                  key={index}
                  type="monotone" 
                  dataKey={series.dataKey} 
                  name={series.name}
                  stroke={series.stroke}
                  strokeWidth={3}
                  dot={{ fill: series.stroke, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: series.stroke, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey={chartConfig.series[0]?.dataKey || 'value'}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={chartConfig.xAxis?.dataKey} 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {chartConfig.series.map((series, index) => (
                <Scatter 
                  key={index}
                  dataKey={series.dataKey} 
                  name={series.name}
                  fill={series.stroke}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="text-center text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800 text-center">
          {chartConfig.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-white rounded-lg p-4">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartRenderer;
