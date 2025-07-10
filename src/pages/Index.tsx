import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, BarChart3, FileSpreadsheet, Loader2, X, LogIn, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard, DashboardData } from '@/contexts/DashboardContext';
import DashboardRenderer from '@/components/DashboardRenderer';
import axios from '@/lib/axios';

const Index = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const { toast } = useToast();
    const { user, isAuthenticated, token } = useAuth();
    const {
        dashboardData,
        setDashboardData,
        files,
        setFiles,
        isLoading,
        setIsLoading,
        resetDashboard
    } = useDashboard();

    // Debug logging

    const handleFileChange = (selectedFiles: File[]) => {
        const validFiles = selectedFiles.filter(file =>
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'application/pdf'
        );

        if (validFiles.length === 0) {
            toast({
                title: "Invalid file type",
                description: "Please upload Excel files (.xlsx) or PDF files (.pdf)",
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
                description: "Please select Excel or PDF files to upload",
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

    const getInitials = (name?: string, email?: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return email ? email[0].toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Data Viz Cascade
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {dashboardData && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center space-x-2">
                                        <RotateCcw className="h-4 w-4" />
                                        <span>New Visualization</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Start New Visualization?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will clear your current dashboard and uploaded files. Are you sure you want to continue?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                resetDashboard();
                                                toast({
                                                    title: "Dashboard cleared",
                                                    description: "Ready for new visualization",
                                                });
                                            }}
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        {isAuthenticated ? (
                            <Link to="/profile">
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src="" alt="Profile" />
                                        <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                            {getInitials(user?.name, user?.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>Profile</span>
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/auth">
                                <Button variant="outline" className="flex items-center space-x-2">
                                    <LogIn className="h-4 w-4" />
                                    <span>Sign In</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <BarChart3 className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Data Viz Cascade
                        </h1>
                    </div>
                    {dashboardData ? (
                        <div className="space-y-2">
                            <p className="text-xl text-gray-600">
                                {dashboardData.dashboard.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                {dashboardData.dashboard.description}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Upload your Excel or PDF files and transform your data into comprehensive dashboards with KPIs, charts, and tables
                        </p>
                    )}
                </div>

                {!dashboardData && (
                    <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl">
                                <FileSpreadsheet className="h-6 w-6 mr-2 text-blue-600" />
                                Upload Excel Files
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${isDragOver
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
                                            Drop your Excel or PDF files here, or{' '}
                                            <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                                                browse
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    multiple
                                                    accept=".xlsx,.xls,.pdf,,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf"
                                                    onChange={(e) => e.target.files && handleFileChange(Array.from(e.target.files))}
                                                />
                                            </label>
                                        </p>
                                        <p className="text-gray-500 mt-2">Supports .xlsx, .xls, and .pdf files up to 10MB</p>
                                    </div>

                                    {files.length > 0 && (
                                        <div className="space-y-2">
                                            {files.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <div className="flex items-center space-x-2">
                                                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                                        <span className="text-green-700 font-medium">{file.name}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleUpload}
                                        disabled={files.length === 0 || isLoading}
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
