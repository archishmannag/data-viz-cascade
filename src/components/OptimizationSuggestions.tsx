
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Zap, Shield, Award } from 'lucide-react';

interface OptimizationSuggestion {
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
}

interface OptimizationSuggestionsProps {
  suggestions: OptimizationSuggestion[];
}

const OptimizationSuggestions = ({ suggestions }: OptimizationSuggestionsProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost':
        return <TrendingUp className="h-5 w-5" />;
      case 'efficiency':
        return <Zap className="h-5 w-5" />;
      case 'performance':
        return <Award className="h-5 w-5" />;
      case 'risk':
        return <Shield className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimization Opportunities</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${suggestion.color}20` }}>
                    <div style={{ color: suggestion.color }}>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(suggestion.priority)}`}></div>
                </div>
                <Badge className={getImpactColor(suggestion.impact)}>
                  {suggestion.impact.toUpperCase()} IMPACT
                </Badge>
              </div>

              <CardTitle className="text-lg font-semibold text-gray-800 mt-3">
                {suggestion.title}
              </CardTitle>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="capitalize">{suggestion.category}</span>
                <span>•</span>
                <span className="font-semibold text-green-600">
                  Save {suggestion.savings.unit === '$' ? '$' : ''}{suggestion.savings.value?.toLocaleString()}{suggestion.savings.unit !== '$' ? suggestion.savings.unit : ''} {suggestion.savings.timeframe}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {suggestion.description}
              </p>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 text-sm">Key Metrics:</h4>
                <ul className="space-y-1">
                  {suggestion.metrics.map((metric, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1">
                {suggestion.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">
                  Potential: {suggestion.savings.percentage}
                </span>
                <span className={`text-sm font-medium ${suggestion.confidence === 'high' ? 'text-green-600' :
                    suggestion.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {suggestion.confidence.toUpperCase()} confidence
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OptimizationSuggestions;
