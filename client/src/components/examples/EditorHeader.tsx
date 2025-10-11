import EditorHeader from '../EditorHeader';

export default function EditorHeaderExample() {
  return (
    <EditorHeader 
      documentTitle="Untitled Document" 
      onClose={() => console.log('Close editor clicked')} 
    />
  );
}
