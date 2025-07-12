import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, Loader2, X, ArrowLeft, CheckCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, DashboardData } from '@/contexts/DashboardContext';
import axios from '@/lib/axios';

const UploadPage = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const { toast } = useToast();
    const { user, isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const {
        dashboardData,
        setDashboardData,
        files,
        setFiles,
        isLoading,
        setIsLoading,
    } = useDashboard();

    const handleFileChange = (selectedFiles: File[]) => {
        const validFiles = selectedFiles.filter(file =>
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'application/pdf' ||
            file.type === 'text/csv'
        );

        if (validFiles.length === 0) {
            toast({
                title: "Invalid file type",
                description: "Please upload Excel, PDF, or CSV files",
                variant: "destructive",
            });
            return;
        }

        if (validFiles.length !== selectedFiles.length) {
            toast({
                title: "Some files skipped",
                description: `${validFiles.length} of ${selectedFiles.length} files are valid. Invalid files were skipped.`,
                variant: "destructive",
            });
        }

        setFiles(validFiles);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFileChange(droppedFiles);
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

    const apiCall = async (): Promise<DashboardData> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const headers: HeadersInit = {
            'Content-Type': 'multipart/form-data'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.post('/generate', formData, { headers });
        return response.data as DashboardData;
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: "No files selected",
                description: "Please select files to upload",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiCall();
            setDashboardData(response);
            toast({
                title: "Upload successful!",
                description: `Generated dashboard with ${response.dashboard.charts.length} charts and ${response.dashboard.kpis.length} KPIs`,
            });
            navigate('/dashboard');
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">TransIQ</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Upload Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">Upload Data</h1>
                            <p className="text-slate-400">Upload your Excel or PDF files to create stunning dashboards</p>
                        </div>

                        {/* Upload Card */}
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardContent className="p-8">
                                <div
                                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${isDragOver
                                        ? 'border-cyan-400 bg-cyan-500/10'
                                        : 'border-slate-600 hover:border-cyan-400 hover:bg-slate-700/30'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Upload className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-white mb-3">Upload Your Data Files</h3>
                                    <p className="text-slate-400 mb-6">
                                        Drag and drop your Excel or PDF files here, or click to browse
                                    </p>

                                    <Button
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-medium"
                                    >
                                        Choose Files
                                    </Button>

                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept=".xlsx,.xls,.pdf,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,text/csv"
                                        onChange={(e) => e.target.files && handleFileChange(Array.from(e.target.files))}
                                    />

                                    <p className="text-sm text-slate-500 mt-4">
                                        Supports .xlsx, .xls, .pdf, .csv files (up to 25MB each)
                                    </p>
                                </div>

                                {/* File List */}
                                {files.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                                <div className="flex items-center space-x-3">
                                                    <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
                                                    <div>
                                                        <p className="text-white font-medium">{file.name}</p>
                                                        <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {files.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Button
                                            onClick={handleUpload}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-medium"
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
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* What happens next */}
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">What happens next?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-sm font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Data Analysis</p>
                                        <p className="text-sm text-slate-400">AI analyzes your data structure and content</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-sm font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Dashboard Creation</p>
                                        <p className="text-sm text-slate-400">Automatic generation of charts and KPIs</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-sm font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Insights Generation</p>
                                        <p className="text-sm text-slate-400">AI-powered recommendations and alerts</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Supported Formats */}
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Supported Formats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
                                        XLS
                                    </Badge>
                                    <span className="text-slate-300">Excel Spreadsheets</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                                        PDF
                                    </Badge>
                                    <span className="text-slate-300">PDF Documents</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                                        CSV
                                    </Badge>
                                    <span className="text-slate-300">Comma Separated Values</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
