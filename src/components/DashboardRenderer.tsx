
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
      type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'table';
      title: string;
      subtitle?: string;
      size: 'full' | 'half' | 'third' | 'quarter';
      chartConfig: any;
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
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{dashboardData.title}</h1>
        <p className="text-gray-600 max-w-4xl mx-auto">{dashboardData.description}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {dashboardData.kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {dashboardData.charts.map((chart) => (
          <div key={chart.id} className={getSizeClass(chart.size)}>
            <ChartRenderer 
              chartData={{
                chartConfig: {
                  type: chart.type as 'bar' | 'line' | 'pie' | 'scatter',
                  title: chart.title,
                  xAxis: chart.chartConfig.xAxis,
                  yAxis: chart.chartConfig.yAxis,
                  series: chart.chartConfig.series
                },
                data: chart.data
              }}
            />
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
        <DataTable key={table.id} tableData={table} />
      ))}
    </div>
  );
};

export default DashboardRenderer;
