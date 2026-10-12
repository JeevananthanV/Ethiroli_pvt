import React from 'react';
import LoginPage from '../../pages/LoginPage.jsx';

/**
 * Project Manager portal sign-in.
 *
 * Same shared sign-in card as every other role portal, with the quick sign-in
 * demo block switched on. The block lists only accounts the API actually
 * returns for the PROJECT_MANAGER role - it never invents people.
 */
export default function PmLoginPage() {
  return <LoginPage portal="pm" demo demoPassword="Pm@123" />;
}
