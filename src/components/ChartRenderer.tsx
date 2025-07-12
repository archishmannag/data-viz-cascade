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
    Sankey,
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
    LabelList,
    Rectangle,
    Layer
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

interface SankeyData {
    nodes: Array<{
        name: string;
    }>;
    links: Array<{
        source: number;
        target: number;
        value: number;
    }>;
}

interface ChartData {
    id: string;
    type: 'AreaChart' | 'BarChart' | 'LineChart' | 'ComposedChart' | 'PieChart' | 'RadarChart' | 'RadialBarChart' | 'ScatterChart' | 'FunnelChart' | 'SankeyChart';
    title: string;
    subtitle?: string;
    size: 'full' | 'half' | 'third' | 'quarter';
    chartConfig: ChartConfig;
    data: Array<Record<string, any>> | SankeyData;
    insights?: string[];
}

interface ChartRendererProps {
    chartData: ChartData;
}

function transformData(data: Record<string, any>[]) {
    if (!Array.isArray(data)) {
        console.warn('transformData expects an array, received:', typeof data);
        return [];
    }

    return data.map(entry => {
        if (!entry || typeof entry !== 'object') {
            return {
                name: "Unknown",
                value: 0,
                color: "#ccc",
            };
        }

        const nameKey = Object.keys(entry).find(
            key => typeof entry[key] === "string" && key !== "color"
        );
        const valueKey = Object.keys(entry).find(
            key => typeof entry[key] === "number"
        );

        return {
            name: nameKey ? entry[nameKey] : "Unknown",
            value: valueKey ? entry[valueKey] : 0,
            color: entry.color || "#ccc",
        };
    });
}

const ChartRenderer = ({ chartData }: ChartRendererProps) => {
    const { type, title, subtitle, chartConfig, data } = chartData;

    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#f97316', '#84cc16'];

    const tooltipStyle = {
        backgroundColor: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        color: '#f1f5f9'
    };

    const legendStyle = {
        color: '#ffffff'
    };

    const renderChart = () => {
        let dataval;

        // Helper function to safely get array data
        const getArrayData = () => {
            if (Array.isArray(data)) {
                return data;
            }
            console.warn('Expected array data but received:', typeof data);
            return [];
        };

        switch (type) {
            case 'AreaChart':
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dataval}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                                stroke="#94a3b8"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataval}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                                stroke="#94a3b8"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataval}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                                stroke="#94a3b8"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={dataval}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                dataKey={chartConfig.xAxis?.dataKey || 'category'}
                                stroke="#94a3b8"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = transformData(getArrayData());
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={transformData(dataval)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent, x, y }) => (
                                    <text
                                        x={x}
                                        y={y}
                                        fill="#ffffff"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fontSize="12"
                                    >
                                        {`${name} ${(percent * 100).toFixed(0)}%`}
                                    </text>
                                )}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {dataval.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color || colors[index % colors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'RadarChart':
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={dataval}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <RadialBarChart data={dataval}>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = getArrayData();
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart data={dataval}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis
                                dataKey={chartConfig.xAxis?.dataKey || 'x'}
                                stroke="#94a3b8"
                                fontSize={12}
                                type={chartConfig.xAxis?.type === 'time' ? 'category' : (chartConfig.xAxis?.type || 'number')}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                domain={chartConfig.yAxis?.domain || ['auto', 'auto']}
                            />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend wrapperStyle={legendStyle} />
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
                dataval = transformData(getArrayData());
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <FunnelChart>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Funnel
                                dataKey="value"
                                data={dataval}
                                isAnimationActive
                            >
                                {dataval.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color || colors[index % colors.length]}
                                    />
                                ))}
                                <LabelList position="right" fill="#ffffff" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                );

            case 'SankeyChart':
                function Node({
                    x,
                    y,
                    width,
                    height,
                    index,
                    payload,
                    containerWidth
                }: any) {
                    const isOut = x + width + 6 > containerWidth;
                    return (
                        <Layer key={`CustomNode${index}`}>
                            <Rectangle
                                x={x}
                                y={y}
                                width={width}
                                height={height}
                                fill="#5192ca"
                                fillOpacity="1"
                            />
                            <text
                                textAnchor={isOut ? "end" : "start"}
                                x={isOut ? x - 6 : x + width + 6}
                                y={y + height / 2}
                                fontSize="14"
                                fill="#ffffff"
                                stroke="none"
                            >
                                {payload.name}
                            </text>
                            <text
                                textAnchor={isOut ? "end" : "start"}
                                x={isOut ? x - 6 : x + width + 6}
                                y={y + height / 2 + 13}
                                fontSize="12"
                                fill="#ffffff"
                                fillOpacity="0.7"
                                stroke="none"
                            >
                                {payload.value + "k"}
                            </text>
                        </Layer>
                    );
                }
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <Sankey data={data as SankeyData} link={{ stroke: colors[0] }} node={<Node containerWidth={300} />}>
                            <Tooltip contentStyle={tooltipStyle} />
                        </Sankey>
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
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 group">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-white text-center">
                    {title}
                </CardTitle>
                {subtitle && (
                    <p className="text-sm text-slate-400 text-center mt-1">{subtitle}</p>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
                    {renderChart()}
                </div>
            </CardContent>
        </Card>
    );
};

export default ChartRenderer;
