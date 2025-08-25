import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check - you can add more sophisticated checks here
    const healthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      memory: process.memoryUsage(),
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
