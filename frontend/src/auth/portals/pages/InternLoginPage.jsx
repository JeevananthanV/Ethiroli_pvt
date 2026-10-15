import React from 'react';
import LoginPage from '../../pages/LoginPage.jsx';

/**
 * Intern portal sign-in.
 *
 * Uses the same shared sign-in card as every other role portal so the two look
 * identical.
 *
 * Interns sign in with their real database-registered credentials.
 * No hardcoded demo fallback arrays.
 */
export default function InternLoginPage() {
  return <LoginPage portal="intern" />;
}