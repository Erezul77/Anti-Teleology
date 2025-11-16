// Stage 1M: File Input/Output operations for MPL

// Import MPL file from user's computer
export function importMPLFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Export MPL program to user's computer
export function exportMPLFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// File validation utilities
export function validateMPLFile(file: File): { isValid: boolean; error?: string } {
  // Check file extension
  if (!file.name.endsWith('.mpl')) {
    return { isValid: false, error: 'File must have .mpl extension' };
  }
  
  // Check file size (max 1MB)
  if (file.size > 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 1MB' };
  }
  
  // Check file type
  if (file.type !== '' && file.type !== 'text/plain') {
    return { isValid: false, error: 'File must be a text file' };
  }
  
  return { isValid: true };
}

// File content utilities
export function sanitizeMPLContent(content: string): string {
  // Remove any potential security risks
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// File naming utilities
export function generateMPLFileName(prefix: string = 'mpl-program'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.mpl`;
}

// File metadata utilities
export function extractMPLMetadata(content: string): {
  title?: string;
  description?: string;
  author?: string;
  version?: string;
  created?: string;
} {
  const metadata: any = {};
  
  // Extract comments that look like metadata
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for metadata comments
    if (trimmed.startsWith('//')) {
      const comment = trimmed.slice(2).trim();
      
      // Title
      if (comment.startsWith('Title:') || comment.startsWith('title:')) {
        metadata.title = comment.split(':')[1]?.trim();
      }
      // Description
      else if (comment.startsWith('Description:') || comment.startsWith('description:')) {
        metadata.description = comment.split(':')[1]?.trim();
      }
      // Author
      else if (comment.startsWith('Author:') || comment.startsWith('author:')) {
        metadata.author = comment.split(':')[1]?.trim();
      }
      // Version
      else if (comment.startsWith('Version:') || comment.startsWith('version:')) {
        metadata.version = comment.split(':')[1]?.trim();
      }
      // Created
      else if (comment.startsWith('Created:') || comment.startsWith('created:')) {
        metadata.created = comment.split(':')[1]?.trim();
      }
    }
  }
  
  return metadata;
}

// File format utilities
export function formatMPLContent(content: string): string {
  // Basic formatting for better readability
  let formatted = content;
  
  // Ensure consistent line endings
  formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Remove excessive empty lines
  formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Ensure proper spacing around operators
  formatted = formatted
    .replace(/([^=!<>])=([^=])/g, '$1 = $2')
    .replace(/([^=!<>])==([^=])/g, '$1 == $2')
    .replace(/([^=!<>])!=([^=])/g, '$1 != $2')
    .replace(/([^=!<>])<([^=])/g, '$1 < $2')
    .replace(/([^=!<>])>([^=])/g, '$1 > $2')
    .replace(/([^=!<>])<=([^=])/g, '$1 <= $2')
    .replace(/([^=!<>])>=([^=])/g, '$1 >= $2');
  
  return formatted;
}

// File backup utilities
export function createMPLBackup(content: string, originalName?: string): void {
  const backupName = originalName 
    ? `${originalName.replace('.mpl', '')}-backup-${Date.now()}.mpl`
    : `mpl-backup-${Date.now()}.mpl`;
  
  exportMPLFile(backupName, content);
}

// File comparison utilities
export function compareMPLFiles(content1: string, content2: string): {
  areEqual: boolean;
  differences: string[];
} {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');
  const differences: string[] = [];
  
  const maxLines = Math.max(lines1.length, lines2.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';
    
    if (line1 !== line2) {
      differences.push(`Line ${i + 1}: "${line1}" vs "${line2}"`);
    }
  }
  
  return {
    areEqual: differences.length === 0,
    differences
  };
}
