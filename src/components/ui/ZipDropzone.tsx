import clsx from "clsx";
import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { ANALYTICS_EVENTS, analyticsService } from "@/analytics";
import { toastService } from "@/services/toastService";
import { FabIcon } from "./FabIcon";
import { Icon } from "./Icon";

type ZipDropzoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onError?: (message: string) => void;
};

export function ZipDropzone({ file, onFileChange, onError }: ZipDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const nextFile = acceptedFiles[0] ?? null;

      if (nextFile) {
        analyticsService.track(ANALYTICS_EVENTS.ZIP_UPLOADED, {
          file_size_mb: Number((nextFile.size / 1024 / 1024).toFixed(2)),
          extension: "zip",
        });
      }

      if (fileRejections.length > 0) {
        const firstError = fileRejections[0]?.errors[0];

        if (firstError?.code === "file-invalid-type") {
          onError?.("Please upload a valid ZIP file.");
          toastService.danger({
            title: "Invalid file",
            description: "Please upload a valid ZIP file.",
          });
          return;
        }

        if (firstError?.code === "too-many-files") {
          onError?.("You can upload only one ZIP file.");
          toastService.danger({
            title: "Too many files",
            description: "You can upload only one ZIP file.",
          });
          return;
        }

        onError?.("File upload failed. Please try again.");
        toastService.danger({
          title: "File upload failed",
          description: "Please try again.",
        });
        return;
      }

      onFileChange(nextFile);
      onError?.("");
    },
    [onFileChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "application/zip": [".zip"],
      },
    });

  return (
    <div className="text-fg flex w-full flex-col gap-3">
      <div
        {...getRootProps()}
        className={clsx(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-card border border-dashed px-5 py-8 text-center transition-colors",
          "focus-visible:shadow-ring focus-visible:outline-none",
          isDragReject
            ? "border-danger/60 bg-danger/6"
            : isDragActive
              ? "border-brand-fg bg-surface-2"
              : "border-line-strong bg-surface-1 hover:border-fg-faint"
        )}
      >
        <input {...getInputProps()} />

        <span className="border-line-strong bg-surface-2 text-brand-fg flex size-11 items-center justify-center rounded-xl border">
          <Icon
            name="upload"
            color="current"
            width={22}
            height={22}
            aria-hidden="true"
          />
        </span>

        <span className="text-[15px] font-medium">
          {isDragActive ? (
            "Drop your ZIP file here"
          ) : (
            <>
              Drag your export here, or{" "}
              <span className="text-brand-fg">browse</span>
            </>
          )}
        </span>

        <span className="text-fg-muted text-xs">
          ZIP file from Instagram&apos;s JSON export
        </span>

        <span className="text-success inline-flex items-center gap-1.5 text-xs">
          <Icon
            name="lock"
            color="current"
            width={12}
            height={12}
            aria-hidden="true"
          />
          Stays on your device
        </span>
      </div>

      {file && (
        <div className="border-line-subtle bg-surface-1 flex items-center gap-3 rounded-control border px-3 py-2.5 text-[13px]">
          <Icon
            name="code"
            color="current"
            width={18}
            height={18}
            className="text-brand-fg shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 text-start">
            <p className="truncate">{file.name}</p>
            <p className="text-fg-faint text-xs tabular-nums">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
          <FabIcon
            icon="close"
            aria-label="Remove file"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
          />
        </div>
      )}
    </div>
  );
}
