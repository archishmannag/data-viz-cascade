import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, Calendar, ArrowLeft, Loader2, Home, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';

interface UserDetails {
    user_id: string;
    email: string;
    name?: string;
    created_at?: string;
    last_login?: string;
}

interface HistoryRecord {
    file_names: string[];
    created_at: string;
}

interface HistoryResponse {
    records: HistoryRecord[];
    count: number;
}

const UserProfile = () => {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const { user, token, logout } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        fetchUserDetails();
        fetchUploadHistory();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('http://0.0.0.0:8001/user/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data.json();
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast({
                title: "Error",
                description: "Failed to load user details",
                variant: "destructive",
            });
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const fetchUploadHistory = async () => {
        try {
            const response = await axios.get('http://0.0.0.0:8001/history/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data.json();
            setHistoryData(data);
        } catch (error) {
            console.error('Error fetching upload history:', error);
            toast({
                title: "Error",
                description: "Failed to load upload history",
                variant: "destructive",
            });
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name?: string, email?: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return email ? email[0].toUpperCase() : 'U';
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out",
            });
        } catch (error) {
            console.error('Logout error:', error);
            toast({
                title: "Logout completed",
                description: "You have been logged out (with some issues)",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Data Viz Cascade
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/">
                            <Button variant="outline" className="flex items-center space-x-2">
                                <Home className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/">
                        <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Dashboard</span>
                        </Button>
                    </Link>
                </div>

                {/* User Profile Section */}
                <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                            <User className="h-6 w-6 mr-2 text-blue-600" />
                            User Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProfile ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading profile...</span>
                            </div>
                        ) : (
                            <div className="flex items-start space-x-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="" alt="Profile" />
                                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                                        {getInitials(userDetails?.name || user?.name, userDetails?.email || user?.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {userDetails?.name || user?.name || 'No name set'}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{userDetails?.email || user?.email}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">User ID:</span>
                                            <span className="ml-2 text-gray-600 font-mono">{userDetails?.user_id || user?.user_id}</span>
                                        </div>
                                        {userDetails?.created_at && (
                                            <div>
                                                <span className="font-medium text-gray-700">Member since:</span>
                                                <span className="ml-2 text-gray-600">{formatDate(userDetails.created_at)}</span>
                                            </div>
                                        )}
                                        {userDetails?.last_login && (
                                            <div>
                                                <span className="font-medium text-gray-700">Last login:</span>
                                                <span className="ml-2 text-gray-600">{formatDate(userDetails.last_login)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload History Section */}
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                            <FileText className="h-6 w-6 mr-2 text-blue-600" />
                            Upload History
                            {historyData && (
                                <Badge variant="secondary" className="ml-3">
                                    {historyData.count} record{historyData.count !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingHistory ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading upload history...</span>
                            </div>
                        ) : !historyData || historyData.records.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">No uploads yet</p>
                                <p className="text-sm">Your upload history will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {historyData.records.map((record, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <span className="text-sm text-gray-600">
                                                                {formatDate(record.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Files ({record.file_names.length}):
                                                            </p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {record.file_names.slice(0, 3).map((fileName, fileIndex) => (
                                                                    <Badge
                                                                        key={fileIndex}
                                                                        variant="outline"
                                                                        className="text-xs max-w-[200px] truncate"
                                                                        title={fileName}
                                                                    >
                                                                        {fileName}
                                                                    </Badge>
                                                                ))}
                                                                {record.file_names.length > 3 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{record.file_names.length - 3} more
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {record.file_names.length > 3 && (
                                                                <details className="mt-2">
                                                                    <summary className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                                                                        Show all files
                                                                    </summary>
                                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                                        {record.file_names.slice(3).map((fileName, fileIndex) => (
                                                                            <Badge
                                                                                key={fileIndex}
                                                                                variant="outline"
                                                                                className="text-xs max-w-[200px] truncate"
                                                                                title={fileName}
                                                                            >
                                                                                {fileName}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </details>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;
