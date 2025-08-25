import React from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

export interface PerformanceMetrics {
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  inp: number | null;
  cls: number | null;
  loadTime: number | null;
  domContentLoaded: number | null;
  renderTime: number | null;
  hydrationTime: number | null;
  jsHeapSize: number | null;
  timestamp: number;
}

export interface RenderingMethodMetrics extends PerformanceMetrics {
  method: "SSR" | "SSG" | "ISR" | "CSR" | "Streaming";
  bundleSize: number | null;
  requestCount: number;
  cacheHit: boolean;
  revalidationTime?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    ttfb: null,
    fcp: null,
    lcp: null,
    inp: null,
    cls: null,
    loadTime: null,
    domContentLoaded: null,
    renderTime: null,
    hydrationTime: null,
    jsHeapSize: null,
    timestamp: Date.now(),
  };

  private startTime: number = performance.now();
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeWebVitals();
      this.initializeNavigationTiming();
      this.initializeMemoryMonitoring();
    }
  }

  private initializeWebVitals() {
    onTTFB((metric) => {
      this.metrics.ttfb = metric.value;
      this.notifyObservers();
    });

    onFCP((metric) => {
      this.metrics.fcp = metric.value;
      this.notifyObservers();
    });

    onLCP((metric) => {
      this.metrics.lcp = metric.value;
      this.notifyObservers();
    });

    onINP((metric) => {
      this.metrics.inp = metric.value;
      this.notifyObservers();
    });

    onCLS((metric) => {
      this.metrics.cls = metric.value;
      this.notifyObservers();
    });
  }

  private initializeNavigationTiming() {
    if (typeof window !== "undefined") {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        this.metrics.loadTime =
          navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.domContentLoaded =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        this.notifyObservers();
      });

      // Monitor React hydration
      const hydrationStart = performance.now();
      window.addEventListener("DOMContentLoaded", () => {
        this.metrics.hydrationTime = performance.now() - hydrationStart;
        this.notifyObservers();
      });
    }
  }

  private initializeMemoryMonitoring() {
    if (typeof window !== "undefined" && "memory" in performance) {
      const updateMemory = () => {
        const memory = (
          performance as Performance & { memory?: { usedJSHeapSize: number } }
        ).memory;
        if (memory) {
          this.metrics.jsHeapSize = memory.usedJSHeapSize;
          this.notifyObservers();
        }
      };

      updateMemory();
      setInterval(updateMemory, 1000); // Update every second
    }
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter((obs) => obs !== callback);
    };
  }

  private notifyObservers() {
    this.metrics.timestamp = Date.now();
    this.observers.forEach((callback) => callback({ ...this.metrics }));
  }

  public getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public markRenderStart() {
    this.metrics.renderTime = performance.now();
  }

  public markRenderEnd() {
    if (this.metrics.renderTime) {
      this.metrics.renderTime = performance.now() - this.metrics.renderTime;
      this.notifyObservers();
    }
  }

  public async measureBundleSize(): Promise<number> {
    try {
      const entries = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];
      const jsEntries = entries.filter(
        (entry) => entry.name.includes(".js") || entry.name.includes("/_next/")
      );

      return jsEntries.reduce(
        (total, entry) => total + (entry.transferSize || 0),
        0
      );
    } catch (error) {
      console.warn("Bundle size measurement failed:", error);
      return 0;
    }
  }

  public getRequestCount(): number {
    const entries = performance.getEntriesByType("resource");
    return entries.length;
  }
}

// Create performance monitor instance only on client side
let performanceMonitorInstance: PerformanceMonitor | null = null;

if (typeof window !== "undefined") {
  performanceMonitorInstance = new PerformanceMonitor();
}

export const performanceMonitor =
  performanceMonitorInstance as PerformanceMonitor;

// Utility functions for specific rendering methods
export const createRenderingMethodMetrics = async (
  method: RenderingMethodMetrics["method"],
  additionalData: Partial<RenderingMethodMetrics> = {}
): Promise<RenderingMethodMetrics> => {
  const defaultMetrics: PerformanceMetrics = {
    ttfb: null,
    fcp: null,
    lcp: null,
    inp: null,
    cls: null,
    loadTime: null,
    domContentLoaded: null,
    renderTime: null,
    hydrationTime: null,
    jsHeapSize: null,
    timestamp: Date.now(),
  };

  const baseMetrics = performanceMonitor
    ? performanceMonitor.getCurrentMetrics()
    : defaultMetrics;
  const bundleSize = performanceMonitor
    ? await performanceMonitor.measureBundleSize()
    : 0;
  const requestCount = performanceMonitor
    ? performanceMonitor.getRequestCount()
    : 0;

  return {
    ...baseMetrics,
    method,
    bundleSize,
    requestCount,
    cacheHit: false, // Default, can be overridden
    ...additionalData,
  };
};

// Hook for React components
export const usePerformanceMetrics = () => {
  const defaultMetrics: PerformanceMetrics = {
    ttfb: null,
    fcp: null,
    lcp: null,
    inp: null,
    cls: null,
    loadTime: null,
    domContentLoaded: null,
    renderTime: null,
    hydrationTime: null,
    jsHeapSize: null,
    timestamp: Date.now(),
  };

  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(
    performanceMonitor ? performanceMonitor.getCurrentMetrics() : defaultMetrics
  );

  React.useEffect(() => {
    if (!performanceMonitor) return;

    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    return unsubscribe;
  }, []);

  return metrics;
};

// Format utilities for display
export const formatMetric = (
  value: number | null,
  unit: string = "ms"
): string => {
  if (value === null) return "N/A";

  if (unit === "ms") {
    return `${Math.round(value)}ms`;
  } else if (unit === "bytes") {
    if (value > 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    } else if (value > 1024) {
      return `${(value / 1024).toFixed(2)} KB`;
    }
    return `${value} B`;
  }

  return `${value}${unit}`;
};

export const getPerformanceGrade = (
  metric: number | null,
  thresholds: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" => {
  if (metric === null) return "poor";

  if (metric <= thresholds.good) return "good";
  if (metric <= thresholds.poor) return "needs-improvement";
  return "poor";
};

// Web Vitals thresholds
export const WEB_VITALS_THRESHOLDS = {
  ttfb: { good: 800, poor: 1800 },
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  inp: { good: 200, poor: 500 },
  cls: { good: 0.1, poor: 0.25 },
};
