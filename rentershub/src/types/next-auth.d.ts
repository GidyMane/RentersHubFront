import { CredentialsProvider } from 'next-auth';

declare module 'next-auth' {
  interface CredentialsProvider<T extends Record<string, any> = Record<string, any>> {
    credentials: {
      username: { label: string; type: string; placeholder: string };
      password: { label: string; type: string; placeholder: string };
      // Add your custom fields here
      contact: { label: string; type: string; placeholder: string };
    };
  }
}