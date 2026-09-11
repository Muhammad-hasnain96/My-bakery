// Centralized API configuration
// In local development, defaults to backend at http://localhost:5000/api
// On Vercel / production, defaults to relative /api or custom VITE_API_URL
export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')

