// Document creation component that integrates with existing OnlyOffice
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Table, Presentation } from 'lucide-react';

interface DocumentCreatorProps {
  onDocumentCreated: (document: any) => void;
}

export const DocumentCreator: React.FC<DocumentCreatorProps> = ({ onDocumentCreated }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'docx' | 'xlsx' | 'pptx'>('docx');
  const [loading, setLoading] = useState(false);
  const { createDocument, departments } = useUser();

  const handleCreate = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const document = await createDocument(title, type);
      
      // Open OnlyOffice editor for the new document
      const editorUrl = `/legacy?type=${type}&title=${encodeURIComponent(title)}`;
      window.open(editorUrl, '_blank');
      
      onDocumentCreated(document);
      setTitle('');
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (docType: string) => {
    switch (docType) {
      case 'docx': return <FileText className="h-5 w-5" />;
      case 'xlsx': return <Table className="h-5 w-5" />;
      case 'pptx': return <Presentation className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Document</CardTitle>
        <CardDescription>
          Start a new document workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Document Type</Label>
          <Select value={type} onValueChange={(value: 'docx' | 'xlsx' | 'pptx') => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="docx">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Word Document</span>
                </div>
              </SelectItem>
              <SelectItem value="xlsx">
                <div className="flex items-center space-x-2">
                  <Table className="h-4 w-4" />
                  <span>Excel Spreadsheet</span>
                </div>
              </SelectItem>
              <SelectItem value="pptx">
                <div className="flex items-center space-x-2">
                  <Presentation className="h-4 w-4" />
                  <span>PowerPoint Presentation</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreate} 
          disabled={!title.trim() || loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Document'}
        </Button>
      </CardContent>
    </Card>
  );
};
