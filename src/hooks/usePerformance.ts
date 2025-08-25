"use client";

import { useState, useEffect, useRef } from "react";
import {
  PerformanceMetrics,
  RenderingMethodMetrics,
  performanceMonitor,
} from "@/lib/performance";

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    performanceMonitor.getCurrentMetrics()
  );

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    return unsubscribe;
  }, []);

  return metrics;
};

// Mock data generator for different rendering methods
const generateRealisticMetrics = (
  method: RenderingMethodMetrics["method"]
): RenderingMethodMetrics => {
  const baseTime = Date.now();
  const variance = () => 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier

  // Characteristic performance profiles for each method
  const profiles = {
    SSR: {
      ttfb: 300 + Math.random() * 200, // Higher TTFB due to server processing
      fcp: 800 + Math.random() * 400,
      lcp: 1200 + Math.random() * 600,
      inp: 150 + Math.random() * 100,
      cls: 0.05 + Math.random() * 0.1,
      bundleSize: 150000 + Math.random() * 50000, // Moderate bundle size
      requestCount: 8 + Math.floor(Math.random() * 4),
      cacheHit: false,
      loadTime: 1500 + Math.random() * 500,
      domContentLoaded: 900 + Math.random() * 300,
      renderTime: 50 + Math.random() * 30,
      hydrationTime: 200 + Math.random() * 100,
      jsHeapSize: 5000000 + Math.random() * 2000000,
    },
    SSG: {
      ttfb: 50 + Math.random() * 100, // Very low TTFB (pre-generated)
      fcp: 400 + Math.random() * 200,
      lcp: 600 + Math.random() * 300,
      inp: 80 + Math.random() * 50,
      cls: 0.02 + Math.random() * 0.05,
      bundleSize: 120000 + Math.random() * 30000, // Smaller bundle
      requestCount: 4 + Math.floor(Math.random() * 3),
      cacheHit: true,
      loadTime: 800 + Math.random() * 200,
      domContentLoaded: 500 + Math.random() * 150,
      renderTime: 20 + Math.random() * 15,
      hydrationTime: 100 + Math.random() * 50,
      jsHeapSize: 3500000 + Math.random() * 1500000,
    },
    ISR: {
      ttfb: 100 + Math.random() * 150, // Low TTFB (cached) but can vary
      fcp: 500 + Math.random() * 250,
      lcp: 800 + Math.random() * 400,
      inp: 100 + Math.random() * 70,
      cls: 0.03 + Math.random() * 0.07,
      bundleSize: 140000 + Math.random() * 40000,
      requestCount: 6 + Math.floor(Math.random() * 3),
      cacheHit: Math.random() > 0.3, // 70% cache hit rate
      loadTime: 1000 + Math.random() * 300,
      domContentLoaded: 700 + Math.random() * 200,
      renderTime: 35 + Math.random() * 20,
      hydrationTime: 150 + Math.random() * 75,
      jsHeapSize: 4200000 + Math.random() * 1800000,
      revalidationTime: 500 + Math.random() * 1000,
    },
    CSR: {
      ttfb: 80 + Math.random() * 120, // Low TTFB (minimal server processing)
      fcp: 1200 + Math.random() * 600, // Higher FCP (client rendering)
      lcp: 1800 + Math.random() * 800,
      inp: 200 + Math.random() * 150,
      cls: 0.08 + Math.random() * 0.15,
      bundleSize: 200000 + Math.random() * 80000, // Larger bundle
      requestCount: 12 + Math.floor(Math.random() * 6),
      cacheHit: false,
      loadTime: 2000 + Math.random() * 800,
      domContentLoaded: 400 + Math.random() * 100, // Fast DOM, slow content
      renderTime: 150 + Math.random() * 100,
      hydrationTime: null, // No hydration in pure CSR
      jsHeapSize: 6500000 + Math.random() * 2500000,
    },
    Streaming: {
      ttfb: 200 + Math.random() * 150, // Moderate TTFB (streaming setup)
      fcp: 600 + Math.random() * 300, // Good FCP (progressive rendering)
      lcp: 1000 + Math.random() * 500,
      inp: 120 + Math.random() * 80,
      cls: 0.04 + Math.random() * 0.08,
      bundleSize: 160000 + Math.random() * 50000,
      requestCount: 10 + Math.floor(Math.random() * 5),
      cacheHit: false,
      loadTime: 1300 + Math.random() * 400,
      domContentLoaded: 800 + Math.random() * 250,
      renderTime: 80 + Math.random() * 50,
      hydrationTime: 180 + Math.random() * 90,
      jsHeapSize: 5500000 + Math.random() * 2000000,
    },
  };

  const profile = profiles[method];

  return {
    method,
    ttfb: profile.ttfb * variance(),
    fcp: profile.fcp * variance(),
    lcp: profile.lcp * variance(),
    inp: profile.inp * variance(),
    cls: profile.cls * variance(),
    loadTime: profile.loadTime * variance(),
    domContentLoaded: profile.domContentLoaded * variance(),
    renderTime: profile.renderTime * variance(),
    hydrationTime: profile.hydrationTime
      ? profile.hydrationTime * variance()
      : null,
    jsHeapSize: profile.jsHeapSize * variance(),
    bundleSize: profile.bundleSize * variance(),
    requestCount: profile.requestCount,
    cacheHit: profile.cacheHit,
    timestamp: baseTime,
    revalidationTime:
      "revalidationTime" in profile ? profile.revalidationTime : undefined,
  };
};

export const useRenderingMethodMetrics = (
  method: RenderingMethodMetrics["method"]
) => {
  const [metrics, setMetrics] = useState<RenderingMethodMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    startTimeRef.current = performance.now();

    const measureMetrics = async () => {
      setIsLoading(true);

      // Simulate loading time based on method characteristics
      const loadingTime = {
        SSR: 800 + Math.random() * 400,
        SSG: 200 + Math.random() * 200,
        ISR: 400 + Math.random() * 300,
        CSR: 1000 + Math.random() * 600,
        Streaming: 600 + Math.random() * 400,
      }[method];

      await new Promise((resolve) => setTimeout(resolve, loadingTime));

      // Generate realistic metrics for this specific rendering method
      const generatedMetrics = generateRealisticMetrics(method);

      setMetrics(generatedMetrics);
      setIsLoading(false);
    };

    measureMetrics();

    // Set up periodic updates to simulate real-time changes
    const interval = setInterval(() => {
      if (!isLoading) {
        const updatedMetrics = generateRealisticMetrics(method);
        setMetrics(updatedMetrics);
      }
    }, 5000 + Math.random() * 10000); // Update every 5-15 seconds

    return () => clearInterval(interval);
  }, [method, isLoading]);

  return { metrics, isLoading };
};

export const useComponentPerformance = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(performance.now());
  const [renderStats, setRenderStats] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
  });

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;

    setRenderStats((prev) => ({
      renderCount: renderCount.current,
      averageRenderTime:
        prev.averageRenderTime === 0
          ? renderTime
          : (prev.averageRenderTime + renderTime) / 2,
      lastRenderTime: renderTime,
    }));

    lastRenderTime.current = currentTime;
  }, []); // Empty dependency array to run only once

  return renderStats;
};

export const useMemoryUsage = () => {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryUsage = () => {
      if (typeof window !== "undefined" && "memory" in performance) {
        const memory = (
          performance as Performance & {
            memory?: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;
        if (memory) {
          setMemoryUsage({
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          });
        }
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 2000);

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
};

export const useNetworkMonitoring = () => {
  const [networkStats, setNetworkStats] = useState({
    requestCount: 0,
    totalTransferSize: 0,
    averageResponseTime: 0,
  });

  useEffect(() => {
    const updateNetworkStats = () => {
      const entries = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];

      const stats = entries.reduce(
        (acc, entry) => {
          acc.requestCount += 1;
          acc.totalTransferSize += entry.transferSize || 0;
          acc.totalResponseTime += entry.responseEnd - entry.responseStart;
          return acc;
        },
        { requestCount: 0, totalTransferSize: 0, totalResponseTime: 0 }
      );

      setNetworkStats({
        requestCount: stats.requestCount,
        totalTransferSize: stats.totalTransferSize,
        averageResponseTime:
          stats.requestCount > 0
            ? stats.totalResponseTime / stats.requestCount
            : 0,
      });
    };

    updateNetworkStats();
    const interval = setInterval(updateNetworkStats, 3000);

    return () => clearInterval(interval);
  }, []);

  return networkStats;
};
