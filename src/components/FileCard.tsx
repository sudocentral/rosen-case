/**
 * FileCard Component
 * Display for uploaded/uploadable files
 */

interface FileCardProps {
  filename: string;
  fileType?: string;
  fileSize?: string;
  status?: "pending" | "uploading" | "processing" | "ready" | "error";
  progress?: number;
  error?: string;
  onDelete?: () => void;
}

function getFileIcon(filename: string, fileType?: string): React.ReactElement {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  
  if (fileType?.includes("pdf") || ext === "pdf") {
    return (
      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" />
      </svg>
    );
  }
  if (fileType?.includes("word") || ["doc", "docx"].includes(ext)) {
    return (
      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v1H8v-1zm0 3h8v1H8v-1z" />
      </svg>
    );
  }
  if (fileType?.includes("image") || ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
      </svg>
    );
  }
  return (
    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
    </svg>
  );
}

export default function FileCard({
  filename,
  fileType,
  fileSize,
  status = "ready",
  progress = 0,
  error,
  onDelete,
}: FileCardProps) {
  const statusColors = {
    pending: "border-gray-200 bg-gray-50",
    uploading: "border-blue-200 bg-blue-50",
    processing: "border-amber-200 bg-amber-50",
    ready: "border-emerald-200 bg-emerald-50",
    error: "border-red-200 bg-red-50",
  };

  return (
    <div className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${statusColors[status]}`}>
      <div className="flex-shrink-0">{getFileIcon(filename, fileType)}</div>
      <div className="flex-grow min-w-0">
        <p className="font-medium text-gray-900 truncate" title={filename}>{filename}</p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {fileSize && <span>{fileSize}</span>}
          {status === "uploading" && <span>Uploading...</span>}
          {status === "processing" && <span>Processing...</span>}
          {status === "ready" && <span className="text-emerald-600">Uploaded</span>}
          {status === "error" && <span className="text-red-600">{error || "Upload failed"}</span>}
        </div>
        {status === "uploading" && (
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      {onDelete && status !== "uploading" && (
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Remove file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
