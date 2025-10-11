export async function createBlankTemplates() {
  console.log('Using local template files from /templates directory');
}

export function getTemplateUrl(fileType: "docx" | "xlsx" | "pptx", host: string): string {
  const templateFile = fileType === "docx" ? "blank.docx" : fileType === "xlsx" ? "blank.xlsx" : "blank.pptx";
  return `${host}/templates/${templateFile}`;
}
