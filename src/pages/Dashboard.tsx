import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, RotateCcw, LogIn, Download, Home, Users, FileText, TrendingUp, Activity } from 'lucide-react';
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
import { useDashboard } from '@/contexts/DashboardContext';
import DashboardRenderer from '@/components/DashboardRenderer';
import { exportDashboardToPDF } from '@/utils/pdfExport';

const Dashboard = () => {
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();
    const { dashboardData, resetDashboard } = useDashboard();
    const [isExporting, setIsExporting] = useState(false);
    const navigate = useNavigate();

    const getInitials = (name?: string, email?: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return email ? email[0].toUpperCase() : 'U';
    };

    const handleExportPDF = async () => {
        if (!dashboardData) return;

        setIsExporting(true);
        try {
            await exportDashboardToPDF(dashboardData.dashboard.title);
            toast({
                title: "PDF Export Successful",
                description: "Dashboard has been exported to PDF successfully",
            });
        } catch (error) {
            console.error('Export failed:', error);
            toast({
                title: "Export Failed",
                description: "Failed to export dashboard to PDF. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    // Redirect to home if no dashboard data
    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">No Dashboard Available</h2>
                    <p className="text-slate-400 mb-6">You need to upload data first to view visualizations.</p>
                    <Link to="/">
                        <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-slate-700/50">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">TransIQ</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Link>
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-cyan-400 bg-slate-800/50">
                        <TrendingUp className="h-4 w-4" />
                        <span>Analytics</span>
                    </div>
                    <Link to="/upload" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors">
                        <FileText className="h-4 w-4" />
                        <span>Upload Data</span>
                    </Link>
                    <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors">
                        <Users className="h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-700/50">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt="Profile" />
                                <AvatarFallback className="text-xs bg-cyan-500 text-white">
                                    {getInitials(user?.name, user?.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">
                                    {user?.name || user?.email}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                    {user?.email}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/auth">
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation */}
                <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {isExporting ? 'Exporting...' : 'Export PDF'}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        New Analysis
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-800 border-slate-700">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-white">Start New Analysis?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-300">
                                            This will clear your current dashboard and uploaded files. Are you sure you want to continue?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                                            onClick={() => {
                                                resetDashboard();
                                                navigate('/upload');
                                                toast({
                                                    title: "Dashboard cleared",
                                                    description: "Ready for new analysis",
                                                });
                                            }}
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-auto">
                    <DashboardRenderer dashboardData={dashboardData.dashboard} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
