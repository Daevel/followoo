import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import clsx from "clsx";
import { Icon } from "../ui/Icon";
import { toastService } from "../services/toastService";
import { analyticsService, ANALYTICS_EVENTS } from "@/analytics";

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
          toastService.warning({
            title: "Invalid file",
            description: "Please upload a valid ZIP file.",
          });
          return;
        }

        if (firstError?.code === "too-many-files") {
          onError?.("You can upload only one ZIP file.");
          toastService.warning({
            title: "Too many files",
            description: "You can upload only one ZIP file.",
          });
          return;
        }

        onError?.("File upload failed. Please try again.");
        toastService.warning({
          title: "File upload failed",
          description: "Please try again.",
        });
        return;
      }

      onFileChange(nextFile);
      onError?.("");
    },
    [onFileChange, onError],
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
    <div className="w-full flex flex-col gap-3 text-foreground">
      <div
        {...getRootProps()}
        className={clsx(
          "w-full cursor-pointer border-2 border-dashed px-6 py-5 transition-colors text-foreground",
          "flex flex-col items-center justify-center gap-2",
          {
            "border-primary bg-primary/15": !isDragActive && !isDragReject,
            "border-primary bg-primary/25": isDragActive && !isDragReject,
            "border-accent bg-accent/10": isDragReject,
          },
        )}
      >
        <input {...getInputProps()} />

        <div className="flex items-center gap-2">
          <Icon
            name="upload"
            color="foreground"
            width={18}
            height={18}
            aria-hidden="true"
          />
          <span className="p1-b">
            {isDragActive ? "Drop your ZIP file here" : "Select your ZIP here"}
          </span>
        </div>

        <span className="text-sm text-foreground/80">
          Drag & drop or click to upload
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-base">{file ? file.name : "No ZIP file selected"}</p>

        {file && (
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="inline-flex items-center gap-2 text-accent hover:opacity-80"
          >
            <Icon
              name="trash"
              color="accent"
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
