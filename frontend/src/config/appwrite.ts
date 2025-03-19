export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'http://localhost:80/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || 'default',
  databaseId: 'finsync',
  collections: {
    transactions: 'transactions',
    accounts: 'accounts'
  },
  buckets: {
    bankStatements: 'bank_statements'
  }
} as const;