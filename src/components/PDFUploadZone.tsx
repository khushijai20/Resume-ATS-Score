import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCheck2,
  Sparkles,
  Clipboard,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileUp,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { ResumeData, JobDescriptionAnalysis } from '../types/resume';
import {
  sampleFresherResume,
  sampleExperiencedResume,
  sampleJobDescriptionJunior,
  sampleJobDescriptionFintech
} from '../utils/sampleData';

interface PDFUploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  onOpenPasteModal: () => void;
  onLoadSample: (resume: ResumeData, jd: JobDescriptionAnalysis, isFresher: boolean) => void;
  currentResumeName: string;
  isLoading: boolean;
}

export const PDFUploadZone: React.FC<PDFUploadZoneProps> = ({
  onFileUpload,
  onOpenPasteModal,
  onLoadSample,
  currentResumeName,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    name: string;
    size: string;
    type: string;
    file: File;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/pdf',
        file
      });
      await onFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/pdf',
        file
      });
      await onFileUpload(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileUp className="w-5 h-5 text-indigo-400" />
            Upload Your Resume
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload your PDF, DOCX, or text resume to automatically extract contact info, skills, projects, and work history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPasteModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
          >
            <Clipboard className="w-3.5 h-3.5 text-sky-400" />
            Paste Plain Text
          </button>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-950/60 hover:bg-slate-950'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Parsing & Structuring Resume...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Extracting technical skills, projects, employment dates & contact info via ATS engine
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-sky-500/10 to-transparent border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-indigo-400" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                <span className="text-indigo-400 underline underline-offset-4 mr-1">Click to browse</span>
                or drag and drop your resume file here
              </p>
              <p className="text-xs text-slate-400">
                Supports PDF, DOCX, or TXT • Maximum file size 25MB
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS-compliant parser</span>
              <span aria-hidden="true">·</span>
              <span>100% private & secure</span>
              <span aria-hidden="true">·</span>
              <span>Zero data hallucination</span>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded File Pill / Status Card */}
      {uploadedFileInfo && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {uploadedFileInfo.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {uploadedFileInfo.size} · Parsed & Indexed for ATS Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
            <button
              type="button"
              onClick={() => {
                setUploadedFileInfo(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Presets / Try Samples */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Or test immediately with preloaded candidate profiles:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onLoadSample(sampleFresherResume, sampleJobDescriptionJunior, true)}
            className="text-left p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-sky-400 transition">
                Fresher Software Engineer Profile
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                UC Davis CS Graduate with capstones, hackathons & React/Node.js stack
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onLoadSample(sampleExperiencedResume, sampleJobDescriptionFintech, false)}
            className="text-left p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                Experienced Full Stack Engineer (4 YOE)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Software Engineer II with distributed Go, PostgreSQL, AWS & microservices
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
