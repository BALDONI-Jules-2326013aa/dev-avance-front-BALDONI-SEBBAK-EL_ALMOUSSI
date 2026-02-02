'use client';

import React, { useState } from 'react';
import { Document as DocumentType } from '@/lib/types';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FileText, Download, ExternalLink, Eye, X } from 'lucide-react';

interface DocumentViewerProps {
  document: DocumentType;
  className?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, className = '' }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isPDF = document.fileUrl.endsWith('.pdf');

  const handleDownload = () => {
    window.open(document.fileUrl, '_blank');
  };

  const handlePreview = () => {
    if (isPDF) {
      setIsPreviewOpen(true);
    } else {
      window.open(document.fileUrl, '_blank');
    }
  };

  return (
    <>
      <Card className={className}>
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{document.title}</h4>
                <p className="text-sm text-gray-500">
                  {isPDF ? 'Document PDF' : 'Document'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Aperçu
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Télécharger
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal de prévisualisation PDF */}
      {isPreviewOpen && isPDF && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900">{document.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Ouvrir dans un nouvel onglet
                </Button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={`${document.fileUrl}#toolbar=0`}
                className="w-full h-full rounded-lg border"
                title={document.title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentViewer;
