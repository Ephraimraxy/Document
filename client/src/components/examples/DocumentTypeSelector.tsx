import DocumentTypeSelector from '../DocumentTypeSelector';

export default function DocumentTypeSelectorExample() {
  return (
    <DocumentTypeSelector onSelect={(type) => console.log('Selected:', type)} />
  );
}
