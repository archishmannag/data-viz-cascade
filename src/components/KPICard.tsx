
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Percent, MapPin, Link, UserCheck } from 'lucide-react';

interface KPIProps {
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

const KPICard = ({ kpi }: KPIProps) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'dollar-sign': DollarSign,
      'trending-up': TrendingUp,
      'users': Users,
      'percent': Percent,
      'map-pin': MapPin,
      'link': Link,
      'user-check': UserCheck,
    };
    
    const IconComponent = iconMap[iconName] || TrendingUp;
    return <IconComponent className="h-6 w-6" style={{ color: kpi.color }} />;
  };

  const getChangeIcon = () => {
    switch (kpi.changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (kpi.changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
            {getIcon(kpi.icon)}
          </div>
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="text-sm font-medium">{kpi.change}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-medium">{kpi.title}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold">{kpi.value}</span>
            {kpi.unit && <span className="text-lg font-semibold text-slate-300">{kpi.unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
