export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: 'finsync',
  collections: {
    transactions: 'transactions',
    accounts: 'accounts'
  },
  buckets: {
    bankStatements: 'bank_statements'
  }
} as const;