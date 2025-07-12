
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface Insights {
  summary: string;
  trends: string[];
  alerts: Array<{
    type: 'warning' | 'error' | 'info' | 'success';
    message: string;
    severity: 'high' | 'medium' | 'low';
    action: string;
  }>;
  recommendations: string[];
}

interface InsightsSectionProps {
  insights: Insights;
}

const InsightsSection = ({ insights }: InsightsSectionProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/10';
      case 'error':
        return 'border-l-red-500 bg-red-500/10';
      case 'success':
        return 'border-l-green-500 bg-green-500/10';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-500/10';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">HIGH</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">MEDIUM</Badge>;
      case 'low':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LOW</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">💡</span>
        </div>
        Key Insights
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 leading-relaxed">{insights.summary}</p>
          </CardContent>
        </Card>

        {/* Trends Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Key Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.trends.map((trend, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm leading-relaxed">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {insights.alerts.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-white">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
              Alerts & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.alerts.map((alert, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type)}
                      <span className="font-medium text-white">{alert.message}</span>
                    </div>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-slate-300 mt-2 ml-7">
                    <strong>Action:</strong> {alert.action}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Section */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-lg text-white">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-400" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsSection;
