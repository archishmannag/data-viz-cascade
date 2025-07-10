import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DashboardData {
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

interface DashboardContextType {
    dashboardData: DashboardData | null;
    setDashboardData: (data: DashboardData | null) => void;
    files: File[];
    setFiles: (files: File[]) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    resetDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const resetDashboard = () => {
        setDashboardData(null);
        setFiles([]);
        setIsLoading(false);
    };

    const value = {
        dashboardData,
        setDashboardData,
        files,
        setFiles,
        isLoading,
        setIsLoading,
        resetDashboard,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
