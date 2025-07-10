import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LabelList
} from 'recharts';

interface ChartConfig {
  xAxis?: {
    dataKey: string;
    label: string;
    type: 'category' | 'number' | 'time';
  };
  yAxis?: {
    label: string;
    domain: [string | number, string | number];
  };
  series?: Array<{
    dataKey: string;
    name: string;
    type: 'bar' | 'line' | 'area';
    color?: string;
    fill?: string;
    stroke?: string;
  }>;
  composedComponents?: Array<{
    type: 'Bar' | 'Line' | 'Area';
    dataKey: string;
    name: string;
    color?: string;
    fill?: string;
    stroke?: string;
  }>;
}

interface ChartData {
  id: string;
  type: 'AreaChart' | 'BarChart' | 'LineChart' | 'ComposedChart' | 'PieChart' | 'RadarChart' | 'RadialBarChart' | 'ScatterChart' | 'FunnelChart' | 'SankeyChart';
  title: string;
  subtitle?: string;
  size: 'full' | 'half' | 'third' | 'quarter';
  chartConfig: ChartConfig;
  data: Array<Record<string, any>>;
  insights?: string[];
}

interface ChartRendererProps {
  chartData: ChartData;
}

const ChartRenderer = ({ chartData }: ChartRendererProps) => {
  const { type, title, subtitle, chartConfig, data } = chartData;

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  const tooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const renderChart = () => {
    switch (type) {
      case 'AreaChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.stroke || series.color || colors[index % colors.length]}
                  strokeWidth={2}
                  fill={series.fill || series.color || colors[index % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'BarChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <Bar
                  key={index}
                  dataKey={series.dataKey}
                  name={series.name}
                  fill={series.fill || series.color || colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'LineChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.stroke || series.color || colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'ComposedChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.composedComponents?.map((component, index) => {
                const color = component.color || colors[index % colors.length];
                switch (component.type) {
                  case 'Bar':
                    return (
                      <Bar
                        key={index}
                        dataKey={component.dataKey}
                        name={component.name}
                        fill={component.fill || color}
                        radius={[4, 4, 0, 0]}
                      />
                    );
                  case 'Line':
                    return (
                      <Line
                        key={index}
                        type="monotone"
                        dataKey={component.dataKey}
                        name={component.name}
                        stroke={component.stroke || color}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    );
                  case 'Area':
                    return (
                      <Area
                        key={index}
                        type="monotone"
                        dataKey={component.dataKey}
                        name={component.name}
                        stroke={component.stroke || color}
                        strokeWidth={2}
                        fill={component.fill || color}
                        fillOpacity={0.3}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'PieChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'RadarChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <Radar
                  key={index}
                  name={series.name}
                  dataKey={series.dataKey}
                  stroke={series.stroke || series.color || colors[index % colors.length]}
                  fill={series.fill || series.color || colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'RadialBarChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart data={data}>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <RadialBar
                  key={index}
                  dataKey={series.dataKey}
                  cornerRadius={10}
                  fill={series.fill || series.color || colors[index % colors.length]}
                />
              ))}
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'ScatterChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={chartConfig.xAxis?.dataKey || 'x'}
                stroke="#6b7280"
                fontSize={12}
                type={chartConfig.xAxis?.type === 'time' ? 'category' : (chartConfig.xAxis?.type || 'number')}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {chartConfig.series?.map((series, index) => (
                <Scatter
                  key={index}
                  name={series.name}
                  dataKey={series.dataKey}
                  fill={series.fill || series.color || colors[index % colors.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'FunnelChart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || colors[index % colors.length]}
                  />
                ))}
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      case 'SankeyChart':
        // Note: Sankey charts require specific data structure and may need additional setup
        return (
          <ResponsiveContainer width="100%" height={300}>
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">Sankey Chart</p>
                <p className="text-sm">Requires specialized data structure</p>
                <p className="text-xs mt-2">Consider using a dedicated Sankey library</p>
              </div>
            </div>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Unsupported Chart Type</p>
              <p className="text-sm">Chart type "{type}" is not supported</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800 text-center">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-sm text-gray-600 text-center mt-1">{subtitle}</p>
        )}
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
