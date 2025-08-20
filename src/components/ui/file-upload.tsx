import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload, File, X, FileText, Image, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  accept?: Record<string, string[]>;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  title?: string;
  description?: string;
}

export function FileUpload({
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "text/csv": [".csv"],
  },
  maxFiles = 5,
  onFilesChange,
  className,
  title = "Upload Files",
  description = "Drag and drop files here, or click to select files",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type === "application/pdf") return FileText;
    if (file.type.includes("spreadsheet") || file.type === "text/csv") return FileSpreadsheet;
    return File;
  };

  return (
    <div className={className}>
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
          isDragActive ? "border-primary bg-primary/5" : "border-border"
        )}
      >
        <div className="p-8 text-center">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button type="button" variant="outline">
            Select Files
          </Button>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files:</h4>
          {files.map((file, index) => {
            const IconComponent = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}