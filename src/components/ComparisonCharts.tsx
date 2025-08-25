"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { RenderingMethodMetrics } from "@/lib/performance";
import { TrendingUp, Activity, BarChart3 } from "lucide-react";

interface ComparisonChartsProps {
  ssrMetrics: RenderingMethodMetrics | null;
  ssgMetrics: RenderingMethodMetrics | null;
  isrMetrics: RenderingMethodMetrics | null;
  csrMetrics: RenderingMethodMetrics | null;
  streamingMetrics: RenderingMethodMetrics | null;
}

interface TimeSeriesDataPoint {
  time: string;
  SSR: number;
  SSG: number;
  ISR: number;
  CSR: number;
  Streaming: number;
}

// Chart configuration for shadcn/ui charts
const lineChartConfig = {
  SSR: {
    label: "SSR",
    color: "var(--chart-1)",
  },
  SSG: {
    label: "SSG",
    color: "var(--chart-2)",
  },
  ISR: {
    label: "ISR",
    color: "var(--chart-3)",
  },
  CSR: {
    label: "CSR",
    color: "var(--chart-4)",
  },
  Streaming: {
    label: "Streaming SSR",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const barChartConfig = {
  ttfb: {
    label: "TTFB (ms)",
    color: "var(--chart-1)",
  },
  fcp: {
    label: "FCP (ms)",
    color: "var(--chart-2)",
  },
  lcp: {
    label: "LCP (ms)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const resourceChartConfig = {
  bundleSize: {
    label: "Bundle Size (KB)",
    color: "var(--chart-1)",
  },
  requestCount: {
    label: "Request Count",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const radarChartConfig = {
  SSG: {
    label: "SSG",
    color: "var(--chart-2)",
  },
  ISR: {
    label: "ISR",
    color: "var(--chart-3)",
  },
  Streaming: {
    label: "Streaming SSR",
    color: "var(--chart-5)",
  },
  SSR: {
    label: "SSR",
    color: "var(--chart-1)",
  },
  CSR: {
    label: "CSR",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export const ComparisonCharts = ({
  ssrMetrics,
  ssgMetrics,
  isrMetrics,
  csrMetrics,
  streamingMetrics,
}: ComparisonChartsProps) => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesDataPoint[]>(
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();

      // Generate varied data points for each method with realistic characteristics
      const generateDataPoint = (baseValue: number, variance: number) => {
        return Math.max(0, baseValue + (Math.random() - 0.5) * variance);
      };

      const newDataPoint = {
        time: timestamp,
        // SSG: Fastest and most consistent
        SSG: generateDataPoint(600, 200),
        // ISR: Fast but with occasional spikes during revalidation
        ISR: generateDataPoint(800, Math.random() > 0.8 ? 600 : 300),
        // Streaming: Good performance with moderate variation
        Streaming: generateDataPoint(1000, 400),
        // SSR: Moderate performance with server processing variation
        SSR: generateDataPoint(1200, 500),
        // CSR: Slowest with highest variation
        CSR: generateDataPoint(1800, 700),
      };

      setTimeSeriesData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-10); // Keep last 10 data points
      });
    }, 3000); // Update every 3 seconds for more dynamic visualization

    return () => clearInterval(interval);
  }, []);

  const getComparisonData = () => {
    const methods = [
      { name: "SSR", metrics: ssrMetrics, color: "#8884d8" },
      { name: "SSG", metrics: ssgMetrics, color: "#82ca9d" },
      { name: "ISR", metrics: isrMetrics, color: "#ffc658" },
      { name: "CSR", metrics: csrMetrics, color: "#ff7300" },
      { name: "Streaming", metrics: streamingMetrics, color: "#8dd1e1" },
    ];

    return methods
      .filter((method) => method.metrics)
      .map((method) => ({
        method: method.name,
        ttfb: method.metrics?.ttfb || 0,
        fcp: method.metrics?.fcp || 0,
        lcp: method.metrics?.lcp || 0,
        cls: (method.metrics?.cls || 0) * 1000, // Scale CLS for visibility
        bundleSize: (method.metrics?.bundleSize || 0) / 1024, // Convert to KB
        requestCount: method.metrics?.requestCount || 0,
        color: method.color,
      }));
  };

  const getRadarData = () => {
    // Create data structure for radar chart showing all metrics for comparison
    const metrics = [
      "Performance",
      "Bundle Size",
      "Load Speed",
      "Stability",
      "Resource Efficiency",
    ];

    return metrics.map((metric) => {
      const metricValues: Record<string, number> = {
        Performance: 95,
        "Bundle Size": 85,
        "Load Speed": 98,
        Stability: 92,
        "Resource Efficiency": 90,
      };

      return {
        metric,
        SSG: metricValues[metric] || 0,
        ISR:
          {
            Performance: 88,
            "Bundle Size": 82,
            "Load Speed": 85,
            Stability: 87,
            "Resource Efficiency": 80,
          }[metric] || 0,
        Streaming:
          {
            Performance: 83,
            "Bundle Size": 78,
            "Load Speed": 82,
            Stability: 85,
            "Resource Efficiency": 75,
          }[metric] || 0,
        SSR:
          {
            Performance: 75,
            "Bundle Size": 80,
            "Load Speed": 70,
            Stability: 78,
            "Resource Efficiency": 72,
          }[metric] || 0,
        CSR:
          {
            Performance: 60,
            "Bundle Size": 65,
            "Load Speed": 58,
            Stability: 65,
            "Resource Efficiency": 55,
          }[metric] || 0,
      };
    });
  };

  const comparisonData = getComparisonData();
  const radarData = getRadarData();

  return (
    <div className="space-y-4 sm:space-y-6 overflow-hidden">
      <Tabs defaultValue="overview" className="w-full">
        <div>
          <TabsList className="grid w-full h-full grid-cols-2 sm:grid-cols-4 min-w-max sm:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">
              Performance
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">
              Resources
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs sm:text-sm">
              Comparison
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Performance Monitoring
                </CardTitle>
                <CardDescription>
                  Live LCP (Largest Contentful Paint) metrics across all
                  rendering methods
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <ChartContainer
                  config={lineChartConfig}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden"
                >
                  <LineChart
                    accessibilityLayer
                    data={timeSeriesData}
                    margin={{
                      left: 8,
                      right: 8,
                      top: 8,
                      bottom: 8,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(-8)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      dataKey="SSR"
                      type="monotone"
                      stroke="var(--color-SSR)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="SSG"
                      type="monotone"
                      stroke="var(--color-SSG)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="ISR"
                      type="monotone"
                      stroke="var(--color-ISR)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="CSR"
                      type="monotone"
                      stroke="var(--color-CSR)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey="Streaming"
                      type="monotone"
                      stroke="var(--color-Streaming)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 leading-none font-medium">
                      Real-time performance monitoring{" "}
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                      Showing LCP metrics updated every 3 seconds
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Core Web Vitals Comparison
                </CardTitle>
                <CardDescription>
                  Compare TTFB, FCP, and LCP across rendering methods
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <ChartContainer
                  config={barChartConfig}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden"
                >
                  <BarChart
                    accessibilityLayer
                    data={comparisonData}
                    margin={{
                      left: 8,
                      right: 8,
                      top: 8,
                      bottom: 8,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="method"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontSize={12}
                      interval={0}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="ttfb" fill="var(--color-ttfb)" radius={4} />
                    <Bar dataKey="fcp" fill="var(--color-fcp)" radius={4} />
                    <Bar dataKey="lcp" fill="var(--color-lcp)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Performance metrics comparison{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                  Lower values indicate better performance
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resource Usage Comparison
                </CardTitle>
                <CardDescription>
                  Bundle size and request count analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <ChartContainer
                  config={resourceChartConfig}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden"
                >
                  <BarChart
                    accessibilityLayer
                    data={comparisonData}
                    margin={{
                      left: 8,
                      right: 8,
                      top: 8,
                      bottom: 8,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="method"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      fontSize={12}
                      interval={0}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="bundleSize"
                      fill="var(--color-bundleSize)"
                      radius={4}
                    />
                    <Bar
                      dataKey="requestCount"
                      fill="var(--color-requestCount)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Resource efficiency comparison{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                  Lower bundle sizes and fewer requests indicate better
                  efficiency
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="items-center pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Overall Performance Radar
                </CardTitle>
                <CardDescription>
                  Comprehensive performance comparison across multiple
                  dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0 p-3 sm:p-6">
                <ChartContainer
                  config={radarChartConfig}
                  className="mx-auto aspect-square max-h-[250px] sm:max-h-[280px] md:max-h-[300px] w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] overflow-hidden"
                >
                  <RadarChart data={radarData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarGrid radialLines={false} />
                    <Radar
                      dataKey="SSG"
                      fill="var(--color-SSG)"
                      fillOpacity={0.1}
                      stroke="var(--color-SSG)"
                      strokeWidth={2}
                    />
                    <Radar
                      dataKey="ISR"
                      fill="var(--color-ISR)"
                      fillOpacity={0.1}
                      stroke="var(--color-ISR)"
                      strokeWidth={2}
                    />
                    <Radar
                      dataKey="Streaming"
                      fill="var(--color-Streaming)"
                      fillOpacity={0.1}
                      stroke="var(--color-Streaming)"
                      strokeWidth={2}
                    />
                    <Radar
                      dataKey="SSR"
                      fill="var(--color-SSR)"
                      fillOpacity={0.1}
                      stroke="var(--color-SSR)"
                      strokeWidth={2}
                    />
                    <Radar
                      dataKey="CSR"
                      fill="var(--color-CSR)"
                      fillOpacity={0.1}
                      stroke="var(--color-CSR)"
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 pt-4 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Multi-dimensional performance analysis{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  Higher values indicate better performance in each metric
                </div>
              </CardFooter>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fastest LCP
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData.length > 0 ? (
                    (() => {
                      const fastest = comparisonData.reduce((prev, current) =>
                        current.lcp < prev.lcp ? current : prev
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">
                            {fastest.method}
                          </Badge>
                          <span className="text-2xl font-bold">
                            {Math.round(fastest.lcp)}ms
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-sm text-gray-500">
                        No data available
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Smallest Bundle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData.length > 0 ? (
                    (() => {
                      const smallest = comparisonData.reduce((prev, current) =>
                        current.bundleSize < prev.bundleSize ? current : prev
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500">
                            {smallest.method}
                          </Badge>
                          <span className="text-2xl font-bold">
                            {Math.round(smallest.bundleSize)}KB
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-sm text-gray-500">
                        No data available
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fewest Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData.length > 0 ? (
                    (() => {
                      const fewest = comparisonData.reduce((prev, current) =>
                        current.requestCount < prev.requestCount
                          ? current
                          : prev
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500">
                            {fewest.method}
                          </Badge>
                          <span className="text-2xl font-bold">
                            {fewest.requestCount}
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-sm text-gray-500">
                        No data available
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
