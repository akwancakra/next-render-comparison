"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Server,
  Globe,
  RefreshCw,
  Monitor,
  Zap,
  BarChart3,
  Activity,
  Settings,
  Play,
  Pause,
  HelpCircle,
} from "lucide-react";
import { MetricsCard } from "@/components/MetricsCard";
import { ComparisonCharts } from "@/components/ComparisonCharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  useRenderingMethodMetrics,
  useMemoryUsage,
  useNetworkMonitoring,
} from "@/hooks/usePerformance";

const RenderingComparisonDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Get metrics for each rendering method
  const { metrics: ssrMetrics, isLoading: ssrLoading } =
    useRenderingMethodMetrics("SSR");
  const { metrics: ssgMetrics, isLoading: ssgLoading } =
    useRenderingMethodMetrics("SSG");
  const { metrics: isrMetrics, isLoading: isrLoading } =
    useRenderingMethodMetrics("ISR");
  const { metrics: csrMetrics, isLoading: csrLoading } =
    useRenderingMethodMetrics("CSR");
  const { metrics: streamingMetrics, isLoading: streamingLoading } =
    useRenderingMethodMetrics("Streaming");

  const memoryUsage = useMemoryUsage();
  const networkStats = useNetworkMonitoring();

  const handleRefresh = () => {
    // Trigger re-measurement by forcing component re-render
    window.location.reload();
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  // Demo data for different rendering methods with detailed explanations
  const renderingMethods = [
    {
      id: "ssr",
      name: "Server-Side Rendering",
      description: "Pages rendered on each request",
      icon: <Server className="h-5 w-5" />,
      color: "bg-blue-500",
      metrics: ssrMetrics,
      isLoading: ssrLoading,
      benefits: [
        "SEO friendly - Full HTML sent to crawlers",
        "Fast initial page load with content",
        "Dynamic content on every request",
        "Better social media sharing",
      ],
      drawbacks: [
        "Higher server load and costs",
        "Slower TTFB due to server processing",
        "Requires server infrastructure",
        "Potential server bottlenecks",
      ],
      expectedPerformance: {
        ttfb: "300-500ms (server processing)",
        fcp: "800-1200ms (network + rendering)",
        lcp: "1200-1800ms (content dependent)",
        bestFor: "Dynamic content, SEO-critical pages",
      },
    },
    {
      id: "ssg",
      name: "Static Site Generation",
      description: "Pages pre-built at build time",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-green-500",
      metrics: ssgMetrics,
      isLoading: ssgLoading,
      benefits: [
        "Fastest loading - served from CDN",
        "Best SEO performance",
        "Lower server costs",
        "Excellent caching capabilities",
      ],
      drawbacks: [
        "Build time increases with pages",
        "Content must be known at build time",
        "Requires rebuild for updates",
        "Not suitable for user-specific content",
      ],
      expectedPerformance: {
        ttfb: "50-150ms (CDN response)",
        fcp: "400-600ms (cached resources)",
        lcp: "600-900ms (pre-optimized)",
        bestFor: "Marketing sites, blogs, documentation",
      },
    },
    {
      id: "isr",
      name: "Incremental Static Regeneration",
      description: "Static with periodic updates",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "bg-yellow-500",
      metrics: isrMetrics,
      isLoading: isrLoading,
      benefits: [
        "Fast loading with fresh content",
        "Background regeneration",
        "Reduced build times",
        "Best of static and dynamic",
      ],
      drawbacks: [
        "Complex caching strategies",
        "Potential stale content",
        "Cache invalidation complexity",
        "Debugging can be challenging",
      ],
      expectedPerformance: {
        ttfb: "100-250ms (cache dependent)",
        fcp: "500-800ms (mixed performance)",
        lcp: "800-1200ms (revalidation affects)",
        bestFor: "E-commerce, news sites, user profiles",
      },
    },
    {
      id: "csr",
      name: "Client-Side Rendering",
      description: "Rendered in the browser",
      icon: <Monitor className="h-5 w-5" />,
      color: "bg-red-500",
      metrics: csrMetrics,
      isLoading: csrLoading,
      benefits: [
        "Rich interactive experiences",
        "Reduced server load",
        "App-like user experience",
        "Easy client-side state management",
      ],
      drawbacks: [
        "SEO challenges without SSR",
        "Slower initial page load",
        "JavaScript dependency",
        "Larger bundle sizes",
      ],
      expectedPerformance: {
        ttfb: "80-200ms (minimal server work)",
        fcp: "1200-1800ms (JS download + execution)",
        lcp: "1800-2500ms (API calls + rendering)",
        bestFor: "Dashboards, admin panels, SPAs",
      },
    },
    {
      id: "streaming",
      name: "Streaming SSR",
      description: "Progressive server rendering",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-purple-500",
      metrics: streamingMetrics,
      isLoading: streamingLoading,
      benefits: [
        "Progressive loading experience",
        "Improved perceived performance",
        "Better user experience",
        "Parallel data fetching",
      ],
      drawbacks: [
        "Complex implementation",
        "Limited browser support",
        "Debugging complexity",
        "Streaming overhead",
      ],
      expectedPerformance: {
        ttfb: "200-400ms (streaming setup)",
        fcp: "600-1000ms (progressive content)",
        lcp: "1000-1500ms (stream completion)",
        bestFor: "Complex pages, data-heavy applications",
      },
    },
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Next.js Rendering Methods Comparison
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-4xl mx-auto sm:mx-0">
              Real-time performance analytics for SSR, SSG, ISR, CSR, and
              Streaming SSR
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <div className="order-1 sm:order-none">
              <ThemeToggle />
            </div>

            <Button
              variant={isMonitoring ? "default" : "outline"}
              onClick={toggleMonitoring}
              className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              size="sm"
            >
              {isMonitoring ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="hidden xs:inline">
                {isMonitoring ? "Pause" : "Resume"} Monitoring
              </span>
              <span className="xs:hidden">
                {isMonitoring ? "Pause" : "Play"}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden xs:inline">Refresh</span>
              <span className="xs:hidden">Refresh</span>
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    Active Monitoring
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {isMonitoring ? "ON" : "OFF"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {memoryUsage && (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      Memory Usage
                    </p>
                    <p className="text-sm sm:text-lg font-bold">
                      {(memoryUsage.used / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    Network Requests
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {networkStats.requestCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explanation Alert */}
        <Alert className="mt-4 sm:mt-6" variant={"info"}>
          <Activity className="h-4 w-4" />
          <AlertTitle>About These Metrics</AlertTitle>
          <AlertDescription>
            The performance metrics shown are realistic simulations based on
            typical characteristics of each rendering method. SSG shows the
            fastest performance due to pre-generation, while CSR shows slower
            initial loads due to client-side rendering. Each method updates
            periodically to demonstrate real-world performance variations.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={setActiveSection}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <TabsList className="grid w-full h-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 min-w-max lg:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="ssr" className="text-xs sm:text-sm">
              SSR
            </TabsTrigger>
            <TabsTrigger value="ssg" className="text-xs sm:text-sm">
              SSG
            </TabsTrigger>
            <TabsTrigger value="isr" className="text-xs sm:text-sm">
              ISR
            </TabsTrigger>
            <TabsTrigger value="csr" className="text-xs sm:text-sm">
              CSR
            </TabsTrigger>
            <TabsTrigger value="streaming" className="text-xs sm:text-sm">
              Streaming
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Quick Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {renderingMethods.map((method) => (
              <Card
                key={method.id}
                className="transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => setActiveSection(method.id)}
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg ${method.color} text-white flex-shrink-0`}
                    >
                      {method.icon}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-xs sm:text-sm font-semibold truncate">
                        {method.name}
                      </CardTitle>
                      <CardDescription className="text-xs truncate">
                        {method.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {method.isLoading ? (
                    <div className="text-center py-3 sm:py-4">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Loading...
                      </p>
                    </div>
                  ) : method.metrics ? (
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">LCP</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {method.metrics.lcp
                            ? `${Math.round(method.metrics.lcp)}ms`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">TTFB</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {method.metrics.ttfb
                            ? `${Math.round(method.metrics.ttfb)}ms`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Bundle</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {method.metrics.bundleSize
                            ? `${Math.round(
                                method.metrics.bundleSize / 1024
                              )}KB`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 text-center py-3 sm:py-4">
                      No data available
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Comparison
              </CardTitle>
              <CardDescription>
                Real-time performance metrics comparison across all rendering
                methods
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <ComparisonCharts
                ssrMetrics={ssrMetrics}
                ssgMetrics={ssgMetrics}
                isrMetrics={isrMetrics}
                csrMetrics={csrMetrics}
                streamingMetrics={streamingMetrics}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Method Tabs */}
        {renderingMethods.map((method) => (
          <TabsContent
            key={method.id}
            value={method.id}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid gap-4 sm:gap-6">
              {/* Method Info */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div
                      className={`p-2 sm:p-3 rounded-lg ${method.color} text-white flex-shrink-0`}
                    >
                      {method.icon}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg sm:text-xl">
                        {method.name}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        {method.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-sm sm:text-base">
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {method.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm sm:text-base">
                        Considerations
                      </h4>
                      <ul className="space-y-1">
                        {method.drawbacks.map((drawback, index) => (
                          <li
                            key={index}
                            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 text-sm sm:text-base">
                        Expected Performance
                      </h4>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-medium">TTFB:</span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {method.expectedPerformance.ttfb}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">FCP:</span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {method.expectedPerformance.fcp}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">LCP:</span>{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {method.expectedPerformance.lcp}
                          </span>
                        </div>
                        <div className="text-xs mt-3">
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            Best for:
                          </span>
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            {method.expectedPerformance.bestFor}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Metrics */}
              {method.metrics && (
                <MetricsCard
                  title={`${method.name} Performance Metrics`}
                  description={`Detailed analytics for ${method.name}`}
                  metrics={method.metrics}
                  method={method.metrics.method}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating Help Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-primary hover:bg-primary/90"
          >
            <HelpCircle className="h-6 w-6" />
            <span className="sr-only">Help - Technical Terms Glossary</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Technical Terms Glossary
            </DialogTitle>
            <DialogDescription>
              Understanding the technical terms used in web rendering methods
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Rendering Methods */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-2">
                Rendering Methods
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">
                      SSR - Server-Side Rendering
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Pages are rendered on the server for each request. Great for
                    SEO and initial page load, but requires more server
                    resources.
                  </p>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-900 dark:text-green-100">
                      SSG - Static Site Generation
                    </span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Pages are pre-built at build time and served as static
                    files. Fastest performance but content must be known at
                    build time.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-medium text-yellow-900 dark:text-yellow-100">
                      ISR - Incremental Static Regeneration
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Combines static generation with periodic updates. Pages can
                    be regenerated in the background when needed.
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-900 dark:text-red-100">
                      CSR - Client-Side Rendering
                    </span>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Pages are rendered in the browser using JavaScript. Great
                    for interactive apps but slower initial load and SEO
                    challenges.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-purple-900 dark:text-purple-100">
                      Streaming SSR
                    </span>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Advanced server rendering that sends content progressively
                    as it becomes ready, improving perceived performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-2">
                Performance Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    TTFB - Time To First Byte
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time from request start until the first byte arrives from
                    the server.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    FCP - First Contentful Paint
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time until the first content (text, image) is rendered on
                    screen.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    LCP - Largest Contentful Paint
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Time until the largest content element is fully rendered.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    INP - Interaction to Next Paint
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Measures responsiveness from user interaction to visual
                    update.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    CLS - Cumulative Layout Shift
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Measures visual stability - how much content shifts during
                    load.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">Bundle Size</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total size of JavaScript and CSS files sent to the browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-2">
                Additional Terms
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">Web Vitals</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Google&apos;s initiative to provide unified guidance for
                    quality signals essential to delivering great user
                    experience on the web.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">
                    CDN - Content Delivery Network
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Network of servers distributed globally to serve content
                    from locations closer to users.
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-sm">Hydration</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Process where client-side JavaScript takes over
                    server-rendered HTML to make it interactive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenderingComparisonDashboard;
