'use client';
import { format } from 'date-fns';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Fragment, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { IconBase } from 'react-icons';

import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const FileUploaderMultiple = ({
  pathFiles,
  setPathFiles,
}: {
  pathFiles: string[];
  setPathFiles: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
    multiple: true,
  });
  const renderFilePreview = (file: File) => {
    if (file.type.startsWith('image')) {
      return (
        <Image
          width={48}
          height={48}
          alt={file.name}
          src={URL.createObjectURL(file)}
          className=' rounded border p-0.5'
        />
      );
    } else {
      return <IconBase />;
    }
  };
  const handleRemoveFile = (file: File) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i: File) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map((file: File) => (
    <div
      key={file.name}
      className='mb-6 flex justify-between rounded-md border px-3.5 py-3'
    >
      <div className='flex items-center space-x-3'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <div className=' text-sm  text-card-foreground'>{file.name}</div>
          <div className=' text-xs font-light text-muted-foreground'>
            {Math.round(file.size / 100) / 10 > 1000 ? (
              <>{(Math.round(file.size / 100) / 10000).toFixed(1)}</>
            ) : (
              <>{(Math.round(file.size / 100) / 10).toFixed(1)}</>
            )}
            {' kb'}
          </div>
        </div>
      </div>
      <Button
        variant='destructive'
        className='aspect-square rounded-full p-3'
        onClick={() => handleRemoveFile(file)}
      >
        <X className='h-10 w-10' />
      </Button>
    </div>
  ));
  const pathList = pathFiles.map((file, index) => (
    <div
      key={index}
      className='mb-6 flex justify-between rounded-md border px-3.5 py-3'
    >
      <div className='text-sm text-card-foreground'>{file}</div>
      <Button
        variant='destructive'
        className='aspect-square rounded-full p-3'
        onClick={() =>
          setPathFiles((prev) => prev.filter((_, i) => i !== index))
        }
      >
        <X className='h-10 w-10' />
      </Button>
    </div>
  ));
  const handleRemoveAllFiles = () => {
    setFiles([]);
    setPathFiles([]);
  };

  const handleUploadFiles = useCallback(async () => {
    setIsLoading(true);
    toast.loading('Uploading...');
    try {
      const uploadPromises = files.map((file) => {
        const filePath =
          format(new Date(), 'dd-MM-yyyy_') + file.name?.replace(/ /g, '_');
        return supabase.storage.from('dokumen').upload(filePath, file);
      });

      const uploadResults = await Promise.all(uploadPromises);

      uploadResults.forEach((result) => {
        if (result.data?.path) {
          setPathFiles((prev) => [...prev, result.data?.path]);
        }
      });
      if (uploadResults) {
        toast.dismiss();
        toast.success('Uploaded Berhasil');
      }
      setFiles([]);
    } catch {
      toast.error('Upload Gagal');
    } finally {
      setIsLoading(false);
    }
  }, [files, setPathFiles]);

  return (
    <div>
      <div {...getRootProps({ className: 'dropzone' })}>
        <Input {...getInputProps()} />
        <div className=' flex w-full flex-col items-center  rounded-md border border-dashed  py-[52px] text-center'>
          <div className='mb-3 inline-flex h-12 w-12 items-center justify-center rounded-md bg-muted'>
            <Upload className='text-default-500 h-6 w-6' />
          </div>
          <h4 className=' mb-1 text-2xl font-medium text-card-foreground/80'>
            Drop files here or click to upload.
          </h4>
        </div>
      </div>
      {pathFiles.length > 0 && (
        <div className='mt-3'>
          <h2>Sudah Di Upload</h2>
          <div>{pathList}</div>
        </div>
      )}
      {files.length ? (
        <div className='mt-3'>
          <h2>Belum Di Upload</h2>
          <div>{fileList}</div>
          <div className=' flex justify-end space-x-2'>
            <Button variant='destructive' onClick={handleRemoveAllFiles}>
              Reset Semua
            </Button>
            <Button
              type='button'
              disabled={isLoading}
              onClick={handleUploadFiles}
            >
              Upload Files
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default FileUploaderMultiple;
