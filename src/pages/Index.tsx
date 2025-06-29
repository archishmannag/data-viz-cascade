
imports React, { useState } from 'react';
import { Upload, BarChart3, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ChartRenderer from '@/components/ChartRenderer';

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

interface ApiResponse {
  charts: ChartData[];
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [charts, setCharts] = useState<ChartData[]>([]);
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

  const simulateApiCall = async (): Promise<ApiResponse> => {
    // Mock API response with sample data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          charts: [
            {
              chartConfig: {
                type: 'bar',
                title: 'Monthly Sales Performance',
                xAxis: { dataKey: 'month', label: 'Month' },
                yAxis: { label: 'Sales ($)' },
                series: [{ dataKey: 'sales', name: 'Sales', stroke: '#3b82f6' }]
              },
              data: [
                { month: 'Jan', sales: 12500 },
                { month: 'Feb', sales: 15600 },
                { month: 'Mar', sales: 18200 },
                { month: 'Apr', sales: 21800 },
                { month: 'May', sales: 19400 },
                { month: 'Jun', sales: 25300 }
              ]
            },
            {
              chartConfig: {
                type: 'line',
                title: 'Customer Growth Trend',
                xAxis: { dataKey: 'quarter', label: 'Quarter' },
                yAxis: { label: 'Customers' },
                series: [{ dataKey: 'customers', name: 'New Customers', stroke: '#10b981' }]
              },
              data: [
                { quarter: 'Q1', customers: 450 },
                { quarter: 'Q2', customers: 680 },
                { quarter: 'Q3', customers: 920 },
                { quarter: 'Q4', customers: 1200 }
              ]
            },
            {
              chartConfig: {
                type: 'pie',
                title: 'Market Share Distribution',
                series: [{ dataKey: 'value', name: 'Market Share', stroke: '#8b5cf6' }]
              },
              data: [
                { name: 'Product A', value: 35 },
                { name: 'Product B', value: 28 },
                { name: 'Product C', value: 22 },
                { name: 'Product D', value: 15 }
              ]
            }
          ]
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
      setCharts(response.charts);
      toast({
        title: "Upload successful!",
        description: `Generated ${response.charts.length} charts from your data`,
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
            Upload your Excel files and transform your data into beautiful, interactive charts instantly
          </p>
        </div>

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
                      Generate Charts
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {charts.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Your Data Visualizations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {charts.map((chart, index) => (
                <ChartRenderer key={index} chartData={chart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
