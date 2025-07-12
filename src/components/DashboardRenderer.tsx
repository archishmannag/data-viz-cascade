
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KPICard from './KPICard';
import ChartRenderer from './ChartRenderer';
import DataTable from './DataTable';
import OptimizationSuggestions from './OptimizationSuggestions';
import InsightsSection from './InsightsSection';

interface DashboardProps {
  dashboardData: {
    title: string;
    description: string;
    kpis: Array<{
      id: string;
      title: string;
      value: number;
      unit: string;
      change: string;
      changeType: 'positive' | 'negative' | 'neutral';
      icon: string;
      color: string;
    }>;
    charts: Array<{
      id: string;
      type: 'AreaChart' | 'BarChart' | 'LineChart' | 'ComposedChart' | 'PieChart' | 'RadarChart' | 'RadialBarChart' | 'ScatterChart' | 'FunnelChart' | 'SankeyChart';
      title: string;
      subtitle?: string;
      size: 'full' | 'half' | 'third' | 'quarter';
      chartConfig: {
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
      };
      data: Array<Record<string, any>>;
      insights?: string[];
    }>;
    tables: Array<{
      id: string;
      title: string;
      columns: Array<{
        key: string;
        label: string;
        type: string;
        format?: string;
      }>;
      data: Array<Record<string, any>>;
      pagination: boolean;
      sortable: boolean;
    }>;
    optimizationSuggestions?: Array<{
      id: string;
      title: string;
      category: 'cost' | 'efficiency' | 'performance' | 'risk' | 'quality';
      impact: 'high' | 'medium' | 'low';
      savings: {
        value: number;
        unit: string;
        percentage: string;
        timeframe: string;
      };
      description: string;
      implementation: string;
      metrics: string[];
      priority: 'high' | 'medium' | 'low';
      confidence: 'high' | 'medium' | 'low';
      tags: string[];
      actionable: boolean;
      color: string;
    }>;
    insights?: {
      summary: string;
      trends: string[];
      alerts: Array<{
        type: 'warning' | 'error' | 'info' | 'success';
        message: string;
        severity: 'high' | 'medium' | 'low';
        action: string;
      }>;
      recommendations: string[];
    };
  };
}

const DashboardRenderer = ({ dashboardData }: DashboardProps) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'full': return 'col-span-12';
      case 'half': return 'col-span-12 lg:col-span-6';
      case 'third': return 'col-span-12 lg:col-span-4';
      case 'quarter': return 'col-span-12 lg:col-span-3';
      default: return 'col-span-12';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div id="dashboard-content" className="max-w-full mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">{dashboardData.title}</h1>
          <p className="text-slate-400 max-w-4xl mx-auto text-lg">{dashboardData.description}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-12 gap-6">
          {dashboardData.charts.map((chart) => (
            <div key={chart.id} className={getSizeClass(chart.size)}>
              <ChartRenderer chartData={chart} />
            </div>
          ))}
        </div>

        {/* Insights Section */}
        {dashboardData.insights && (
          <InsightsSection insights={dashboardData.insights} />
        )}

        {/* Optimization Suggestions */}
        {dashboardData.optimizationSuggestions && dashboardData.optimizationSuggestions.length > 0 && (
          <OptimizationSuggestions suggestions={dashboardData.optimizationSuggestions} />
        )}

        {/* Data Tables */}
        {dashboardData.tables.map((table) => (
          <div key={table.id} className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">📊</span>
              </div>
              Data Tables
            </h2>
            <DataTable tableData={table} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRenderer;
