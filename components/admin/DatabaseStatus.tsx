"use client";

import { useState, useEffect } from "react";

interface DatabaseStatusProps {
  className?: string;
}

export default function DatabaseStatus({ className = "" }: DatabaseStatusProps) {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch("/api/health");
        const result = await response.json();
        
        if (result.success && result.data.status === "connected") {
          setStatus("connected");
        } else {
          setStatus("error");
          setError(result.message || "Database connection failed");
        }
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    checkDatabase();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "checking": return "text-yellow-600 bg-yellow-50";
      case "connected": return "text-green-600 bg-green-50";
      case "error": return "text-red-600 bg-red-50";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "checking":
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "connected":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "checking": return "Đang kiểm tra...";
      case "connected": return "Database kết nối";
      case "error": return "Lỗi database";
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      {status === "error" && error && (
        <span className="text-xs opacity-75" title={error}>
          ({error.substring(0, 20)}...)
        </span>
      )}
    </div>
  );
}