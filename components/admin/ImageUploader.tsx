"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;           // URL hiện tại
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  aspectRatio?: "square" | "wide"; // preview ratio
}

export default function ImageUploader({
  value,
  onChange,
  label,
  required,
  error,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        onChange(result.data.url);
      } else {
        setUploadError(result.message || "Upload thất bại");
      }
    } catch {
      setUploadError("Lỗi kết nối, thử lại");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setUploadError("");
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Preview hoặc Drop zone */}
      {value ? (
        <div className="relative group">
          <div
            className={`relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${
              aspectRatio === "square" ? "aspect-square" : "aspect-video"
            }`}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain p-2"
              sizes="300px"
            />
            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Đổi ảnh
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa
              </button>
            </div>
          </div>
          {/* URL nhỏ bên dưới */}
          <p className="text-xs text-gray-400 mt-1 truncate">{value}</p>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors
            ${aspectRatio === "square" ? "aspect-square" : "aspect-video min-h-[120px]"}
            ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
            ${error ? "border-red-400" : ""}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-500">Đang upload...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {dragOver ? "Thả ảnh vào đây" : "Kéo thả hoặc click để chọn"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP tối đa 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input file ẩn */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hoặc nhập URL */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">hoặc nhập URL</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// hoặc /uploads/..."
          className={`w-full h-9 border rounded-lg px-3 text-xs focus:outline-none focus:border-blue-500 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
      </div>

      {(error || uploadError) && (
        <p className="text-red-500 text-xs mt-1">{uploadError || error}</p>
      )}
    </div>
  );
}
