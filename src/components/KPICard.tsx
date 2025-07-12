import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Activity } from 'lucide-react';

interface KPICardProps {
  kpi: {
    id: string;
    title: string;
    value: number;
    unit: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: string;
    color: string;
  };
}

const KPICard = ({ kpi }: KPICardProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'dollar':
      case 'dollarsign':
        return <DollarSign className="h-6 w-6" />;
      case 'users':
        return <Users className="h-6 w-6" />;
      case 'activity':
        return <Activity className="h-6 w-6" />;
      case 'barchart':
      case 'chart':
        return <BarChart3 className="h-6 w-6" />;
      default:
        return <TrendingUp className="h-6 w-6" />;
    }
  };

  const getChangeIcon = () => {
    if (kpi.changeType === 'positive') {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    } else if (kpi.changeType === 'negative') {
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    }
    return null;
  };

  const getChangeColor = () => {
    if (kpi.changeType === 'positive') {
      return 'text-green-400';
    } else if (kpi.changeType === 'negative') {
      return 'text-red-400';
    }
    return 'text-slate-400';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value}%`;
    }
    if (unit === '$' || unit === 'USD') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value.toFixed(0)}`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-lg flex items-center justify-center group-hover:from-cyan-400/30 group-hover:to-teal-400/30 transition-all duration-300">
              <div className="text-cyan-400">
                {getIcon(kpi.icon)}
              </div>
            </div>
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-1">
            {getChangeIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {kpi.change}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">
            {formatValue(kpi.value, kpi.unit)}
          </div>
          <div className="text-sm text-slate-400 font-medium">
            {kpi.title}
          </div>
        </div>

        {/* Subtle gradient bar at bottom */}
        <div className="mt-4 h-1 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full w-3/4"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;