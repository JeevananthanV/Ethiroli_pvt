import React from 'react';
import LoginPage from '../../pages/LoginPage.jsx';

/**
 * Intern portal sign-in.
 *
 * Uses the same shared sign-in card as every other role portal so the two look
 * identical.
 *
 * The quick sign-in demo block is deliberately OFF. It was a development
 * affordance: it listed real intern accounts from the database straight into
 * the login screen, with a shared password filled in for you. That is not
 * acceptable in a live portal - it advertises who works here and hands out
 * credentials. Interns now sign in with the email and password they set up
 * themselves (self-registration from the public site, or one issued by HR).
 *
 * The `demo` prop is what switches that block on, so simply not passing it is
 * the whole change - no other markup involved.
 */
export default function InternLoginPage() {
  return <LoginPage portal="intern" />;
}