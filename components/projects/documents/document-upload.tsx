import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProjectApi, type ProjectDocument } from '@/lib/api/project-api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/components/ui/use-toast';
import { formatBytes } from '@/lib/utils';

interface DocumentUploadProps {
  projectId: string;
  onSuccess?: (document: ProjectDocument) => void;
}

export function DocumentUpload({ projectId, onSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { data, error } = await ProjectApi.uploadDocument(projectId, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw new Error(error.message);

      if (data) {
        toast({
          title: 'Document uploaded',
          description: 'Your document has been uploaded successfully.',
        });
        onSuccess?.(data);
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [projectId, onSuccess, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
          ${isUploading ? 'pointer-events-none opacity-50' : 'hover:border-primary hover:bg-primary/5'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Icons.upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the file here</p>
          ) : (
            <>
              <p className="font-medium">Drag & drop a file here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}

interface DocumentListProps {
  projectId: string;
  documents: ProjectDocument[];
  onDelete?: (documentId: string) => void;
}

export function DocumentList({ projectId, documents, onDelete }: DocumentListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (documentId: string) => {
    setIsDeleting(documentId);
    try {
      const { error } = await ProjectApi.deleteDocument(projectId, documentId);
      if (error) throw new Error(error.message);
      
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully.',
      });
      
      onDelete?.(documentId);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete document',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (!documents.length) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">
        No documents uploaded yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Icons.file className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(doc.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <Icons.externalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(doc.id)}
              disabled={isDeleting === doc.id}
            >
              {isDeleting === doc.id ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
