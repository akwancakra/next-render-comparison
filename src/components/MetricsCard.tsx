"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Clock,
  Database,
  Globe,
  MemoryStick,
  Network,
  Zap,
  BarChart3,
} from "lucide-react";
import {
  PerformanceMetrics,
  RenderingMethodMetrics,
  formatMetric,
  getPerformanceGrade,
  WEB_VITALS_THRESHOLDS,
} from "@/lib/performance";

interface MetricsCardProps {
  title: string;
  description?: string;
  metrics: PerformanceMetrics | RenderingMethodMetrics;
  method?: string;
  className?: string;
}

export const MetricsCard = ({
  title,
  description,
  metrics,
  method,
  className,
}: MetricsCardProps) => {
  return (
    <Card
      className={`${className} transition-all duration-300 hover:shadow-lg`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-semibold">
            {title}
          </CardTitle>
          {method && (
            <Badge
              variant="secondary"
              className="font-medium text-xs sm:text-sm w-fit"
            >
              {method}
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Core Web Vitals */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            Core Web Vitals
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <MetricItem
              label="TTFB"
              value={formatMetric(metrics.ttfb)}
              grade={getPerformanceGrade(
                metrics.ttfb,
                WEB_VITALS_THRESHOLDS.ttfb
              )}
              icon={<Clock className="h-4 w-4" />}
            />
            <MetricItem
              label="FCP"
              value={formatMetric(metrics.fcp)}
              grade={getPerformanceGrade(
                metrics.fcp,
                WEB_VITALS_THRESHOLDS.fcp
              )}
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricItem
              label="LCP"
              value={formatMetric(metrics.lcp)}
              grade={getPerformanceGrade(
                metrics.lcp,
                WEB_VITALS_THRESHOLDS.lcp
              )}
              icon={<Globe className="h-4 w-4" />}
            />
            <MetricItem
              label="INP"
              value={formatMetric(metrics.inp)}
              grade={getPerformanceGrade(
                metrics.inp,
                WEB_VITALS_THRESHOLDS.inp
              )}
              icon={<Database className="h-4 w-4" />}
            />
          </div>

          {metrics.cls !== null && (
            <MetricItem
              label="CLS"
              value={metrics.cls.toFixed(3)}
              grade={getPerformanceGrade(
                metrics.cls,
                WEB_VITALS_THRESHOLDS.cls
              )}
              icon={<Network className="h-4 w-4" />}
              fullWidth
            />
          )}
        </div>

        <Separator />

        {/* Additional Metrics */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <MemoryStick className="h-3 w-3 sm:h-4 sm:w-4" />
            Additional Metrics
          </h4>

          <div className="space-y-1.5 sm:space-y-2">
            {metrics.loadTime !== null && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Load Time
                </span>
                <span className="font-medium text-xs sm:text-sm">
                  {formatMetric(metrics.loadTime)}
                </span>
              </div>
            )}

            {metrics.domContentLoaded !== null && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  DOM Content Loaded
                </span>
                <span className="font-medium text-xs sm:text-sm">
                  {formatMetric(metrics.domContentLoaded)}
                </span>
              </div>
            )}

            {metrics.jsHeapSize !== null && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  JS Heap Size
                </span>
                <span className="font-medium text-xs sm:text-sm">
                  {formatMetric(metrics.jsHeapSize, "bytes")}
                </span>
              </div>
            )}

            {/* Rendering method specific metrics */}
            {"method" in metrics && (
              <>
                {metrics.bundleSize !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Bundle Size
                    </span>
                    <span className="font-medium">
                      {formatMetric(metrics.bundleSize, "bytes")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Request Count
                  </span>
                  <span className="font-medium">{metrics.requestCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Cache Hit
                  </span>
                  <Badge variant={metrics.cacheHit ? "default" : "secondary"}>
                    {metrics.cacheHit ? "Yes" : "No"}
                  </Badge>
                </div>

                {metrics.revalidationTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Revalidation Time
                    </span>
                    <span className="font-medium">
                      {formatMetric(metrics.revalidationTime)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Performance Score */}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Performance Score</span>
            <span className="text-sm text-muted-foreground">
              {new Date(metrics.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <PerformanceScore metrics={metrics} />
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricItemProps {
  label: string;
  value: string;
  grade: "good" | "needs-improvement" | "poor";
  icon: React.ReactNode;
  fullWidth?: boolean;
}

const MetricItem = ({
  label,
  value,
  grade,
  icon,
  fullWidth,
}: MetricItemProps) => {
  const getGradeColor = (grade: "good" | "needs-improvement" | "poor") => {
    switch (grade) {
      case "good":
        return "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "needs-improvement":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300";
      case "poor":
        return "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300";
    }
  };

  return (
    <div
      className={`
      ${fullWidth ? "col-span-2" : ""}
      p-3 rounded-lg border-2 ${getGradeColor(
        grade
      )} transition-all duration-200
    `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  );
};

const PerformanceScore = ({ metrics }: { metrics: PerformanceMetrics }) => {
  // Calculate a simple performance score based on Web Vitals
  const calculateScore = (): number => {
    let score = 100;
    let validMetrics = 0;

    if (metrics.ttfb !== null) {
      const grade = getPerformanceGrade(
        metrics.ttfb,
        WEB_VITALS_THRESHOLDS.ttfb
      );
      score -= grade === "poor" ? 20 : grade === "needs-improvement" ? 10 : 0;
      validMetrics++;
    }

    if (metrics.fcp !== null) {
      const grade = getPerformanceGrade(metrics.fcp, WEB_VITALS_THRESHOLDS.fcp);
      score -= grade === "poor" ? 20 : grade === "needs-improvement" ? 10 : 0;
      validMetrics++;
    }

    if (metrics.lcp !== null) {
      const grade = getPerformanceGrade(metrics.lcp, WEB_VITALS_THRESHOLDS.lcp);
      score -= grade === "poor" ? 25 : grade === "needs-improvement" ? 15 : 0;
      validMetrics++;
    }

    if (metrics.inp !== null) {
      const grade = getPerformanceGrade(metrics.inp, WEB_VITALS_THRESHOLDS.inp);
      score -= grade === "poor" ? 20 : grade === "needs-improvement" ? 10 : 0;
      validMetrics++;
    }

    if (metrics.cls !== null) {
      const grade = getPerformanceGrade(metrics.cls, WEB_VITALS_THRESHOLDS.cls);
      score -= grade === "poor" ? 15 : grade === "needs-improvement" ? 8 : 0;
      validMetrics++;
    }

    return validMetrics > 0 ? Math.max(0, score) : 0;
  };

  const score = calculateScore();
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-2">
      <Progress value={score} className="h-2" />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Overall Score</span>
        <span className={`font-bold text-lg ${getScoreColor(score)}`}>
          {Math.round(score)}/100
        </span>
      </div>
    </div>
  );
};
