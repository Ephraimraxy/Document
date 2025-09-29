/**
 * Utility functions shared between client and server
 */

/**
 * Maps email addresses to department IDs based on company email structure
 * @param email - The email address to analyze
 * @returns The department ID for the user
 */
export function getDepartmentFromEmail(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Special case for admin
  if (normalizedEmail === "hoseaephraim50@gmail.com") {
    return "admin";
  }
  
  // Department mapping for CSS email pattern
  const departmentMap: Record<string, string> = {
    "csshr@gmail.com": "hr",
    "cssaccounts@gmail.com": "accounts", 
    "cssaudit@gmail.com": "audit",
    "cssict@gmail.com": "ict",
    "csslogistics@gmail.com": "logistics",
    "cssmarketing@gmail.com": "marketing"
  };
  
  // Check if email matches any department pattern
  if (departmentMap[normalizedEmail]) {
    return departmentMap[normalizedEmail];
  }
  
  // Default fallback to unassigned if no match found - prevents unauthorized admin access
  return "unassigned";
}

/**
 * Determines user role based on email address
 * @param email - The email address to analyze  
 * @returns The role for the user
 */
export function getRoleFromEmail(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Admin gets admin role
  if (normalizedEmail === "hoseaephraim50@gmail.com") {
    return "admin";
  }
  
  // All department heads get user role by default
  // This can be upgraded manually later if needed
  return "user";
}

/**
 * Gets the complete list of department emails
 * @returns Object mapping department IDs to their respective email addresses
 */
export function getDepartmentEmails(): Record<string, string> {
  return {
    admin: "hoseaephraim50@gmail.com",
    hr: "csshr@gmail.com", 
    accounts: "cssaccounts@gmail.com",
    audit: "cssaudit@gmail.com",
    ict: "cssict@gmail.com",
    logistics: "csslogistics@gmail.com",
    marketing: "cssmarketing@gmail.com"
  };
}