
import React, { useState } from 'react';
import { Upload, BarChart3, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import DashboardRenderer from '@/components/DashboardRenderer';

interface DashboardData {
  dashboard: {
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
  };
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx)",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const simulateApiCall = async (): Promise<DashboardData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dashboard: {
            title: "Petroleum Products and Infrastructure Dashboard",
            description: "Comprehensive analysis of petroleum production, refinery operations, and infrastructure utilization",
            kpis: [
              {
                id: "kpi1",
                title: "Total LPG Production",
                value: 32.4,
                unit: "M",
                change: "+4.1%",
                changeType: "positive",
                icon: "trending-up",
                color: "#10B981"
              },
              {
                id: "kpi2", 
                title: "DPNG Connections",
                value: 1.29,
                unit: "Cr",
                change: "+2.3%",
                changeType: "positive",
                icon: "link",
                color: "#3B82F6"
              },
              {
                id: "kpi3",
                title: "DPNG Penetration",
                value: 5.8,
                unit: "%",
                change: "+0.5%",
                changeType: "positive", 
                icon: "percent",
                color: "#8B5CF6"
              },
              {
                id: "kpi4",
                title: "Zero DPNG States",
                value: 5,
                unit: "",
                change: "-1",
                changeType: "positive",
                icon: "map-pin",
                color: "#F59E0B"
              },
              {
                id: "kpi5",
                title: "PMUV Connections",
                value: 8.2,
                unit: "Cr",
                change: "+1.8%",
                changeType: "positive",
                icon: "users",
                color: "#EF4444"
              },
              {
                id: "kpi6",
                title: "Non-PMUV Connections", 
                value: 14.2,
                unit: "Cr",
                change: "+3.2%",
                changeType: "positive",
                icon: "user-check",
                color: "#06B6D4"
              }
            ],
            charts: [
              {
                id: "chart1",
                type: "bar",
                title: "Production of Petroleum Products (Year-wise)",
                size: "half",
                chartConfig: {
                  xAxis: { dataKey: "year", label: "Year" },
                  yAxis: { label: "Production (MT)" },
                  series: [
                    { dataKey: "lpg", name: "LPG", color: "#3B82F6", stroke: "#3B82F6" },
                    { dataKey: "motorSpirit", name: "Motor Spirit", color: "#10B981", stroke: "#10B981" }
                  ]
                },
                data: [
                  { year: "2020-21", lpg: 16800, motorSpirit: 57754 },
                  { year: "2021-22", lpg: 17786, motorSpirit: 38059 },
                  { year: "2022-23", lpg: 33603, motorSpirit: 38816 }
                ]
              },
              {
                id: "chart2",
                type: "bar",
                title: "Refinery-wise Production",
                size: "half", 
                chartConfig: {
                  xAxis: { dataKey: "refinery", label: "Refinery" },
                  yAxis: { label: "Production" },
                  series: [
                    { dataKey: "production", name: "Production", color: "#10B981", stroke: "#10B981" }
                  ]
                },
                data: [
                  { refinery: "IOCL Guwahati", production: 25000 },
                  { refinery: "IOCL Barauni", production: 48000 }
                ]
              },
              {
                id: "chart3",
                type: "bar",
                title: "Regional Performance",
                size: "half",
                chartConfig: {
                  xAxis: { dataKey: "region", label: "Region" },
                  yAxis: { label: "Connections" },
                  series: [
                    { dataKey: "connections", name: "DPNG Connections", color: "#3B82F6", stroke: "#3B82F6" }
                  ]
                },
                data: [
                  { region: "West", connections: 15 },
                  { region: "South", connections: 8 },
                  { region: "North", connections: 3 },
                  { region: "East", connections: 2 },
                  { region: "North-East", connections: 1 }
                ]
              },
              {
                id: "chart4",
                type: "line",
                title: "DPNG Penetration Trend",
                size: "half",
                chartConfig: {
                  xAxis: { dataKey: "month", label: "Month" },
                  yAxis: { label: "Penetration %" },
                  series: [
                    { dataKey: "penetration", name: "DPNG Penetration", color: "#8B5CF6", stroke: "#8B5CF6" }
                  ]
                },
                data: [
                  { month: "Jan", penetration: 5.2 },
                  { month: "Feb", penetration: 5.4 },
                  { month: "Mar", penetration: 5.6 },
                  { month: "Apr", penetration: 5.7 },
                  { month: "May", penetration: 5.8 }
                ]
              },
              {
                id: "chart5",
                type: "bar",
                title: "Connection Type Analysis",
                size: "full",
                chartConfig: {
                  xAxis: { dataKey: "state", label: "State" },
                  yAxis: { label: "Connections" },
                  series: [
                    { dataKey: "pmuv", name: "PMUV Connections", color: "#F59E0B", stroke: "#F59E0B" },
                    { dataKey: "nonPmuv", name: "Non-PMUV Connections", color: "#10B981", stroke: "#10B981" },
                    { dataKey: "dpng", name: "DPNG Connections", color: "#3B82F6", stroke: "#3B82F6" }
                  ]
                },
                data: [
                  { state: "Gujarat", pmuv: 25, nonPmuv: 65, dpng: 140 },
                  { state: "Delhi", pmuv: 15, nonPmuv: 45, dpng: 55 },
                  { state: "Maharashtra", pmuv: 35, nonPmuv: 85, dpng: 120 },
                  { state: "Tripura", pmuv: 5, nonPmuv: 15, dpng: 8 },
                  { state: "Chandigarh", pmuv: 8, nonPmuv: 22, dpng: 12 }
                ]
              }
            ],
            tables: [
              {
                id: "table1",
                title: "State-wise Analysis",
                columns: [
                  { key: "state", label: "State", type: "text" },
                  { key: "dpngPercent", label: "DPNG %", type: "number" },
                  { key: "dpngConnections", label: "DPNG Connections", type: "number" },
                  { key: "pmuv", label: "PMUV", type: "number" },
                  { key: "nonPmuv", label: "Non-PMUV", type: "number" },
                  { key: "region", label: "Region", type: "text" }
                ],
                data: [
                  { state: "Gujarat", dpngPercent: 39.7, dpngConnections: 32.0, pmuv: 20.0, nonPmuv: 60.0, region: "West" },
                  { state: "Delhi", dpngPercent: 29.3, dpngConnections: 18.0, pmuv: 10.0, nonPmuv: 50.0, region: "North" },
                  { state: "Maharashtra", dpngPercent: 14, dpngConnections: 25.0, pmuv: 40.0, nonPmuv: 140.0, region: "West" },
                  { state: "Tripura", dpngPercent: 12.2, dpngConnections: 1.5, pmuv: 3.0, nonPmuv: 9.3, region: "North-East" },
                  { state: "Chandigarh", dpngPercent: 9, dpngConnections: 0.9, pmuv: 2.0, nonPmuv: 8.0, region: "North" }
                ],
                pagination: true,
                sortable: true
              }
            ]
          }
        });
      }, 2000);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await simulateApiCall();
      setDashboardData(response);
      toast({
        title: "Upload successful!",
        description: `Generated dashboard with ${response.dashboard.charts.length} charts and ${response.dashboard.kpis.length} KPIs`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Viz Cascade
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your Excel files and transform your data into comprehensive dashboards with KPIs, charts, and tables
          </p>
        </div>

        {!dashboardData && (
          <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileSpreadsheet className="h-6 w-6 mr-2 text-blue-600" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="space-y-4">
                  <div>
                    <p className="text-xl font-medium text-gray-700">
                      Drop your Excel file here, or{' '}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        />
                      </label>
                    </p>
                    <p className="text-gray-500 mt-2">Supports .xlsx files up to 10MB</p>
                  </div>
                  
                  {file && (
                    <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">{file.name}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Generate Dashboard
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {dashboardData && (
          <DashboardRenderer dashboardData={dashboardData.dashboard} />
        )}
      </div>
    </div>
  );
};

export default Index;
