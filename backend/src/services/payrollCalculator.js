import { logger } from '../config/logger.js';

export const calculateSalaryComponents = (basicSalary) => {
  const basic = parseFloat(basicSalary) || 0;

  const hra = basic * 0.40;
  const da = basic * 0.10;
  const specialAllowance = basic * 0.05;
  const gross = basic + hra + da + specialAllowance;

  const pf = Math.min(basic * 0.12, 18000);
  const esi = gross <= 21000 ? gross * 0.0075 : 0;

  const grossDeductions = pf + esi;
  const net = gross - grossDeductions;

  logger.info('Salary components calculated', { basic, hra, da, pf, esi, gross, net });

  return {
    basic,
    hra: Math.round(hra * 100) / 100,
    da: Math.round(da * 100) / 100,
    special_allowance: Math.round(specialAllowance * 100) / 100,
    pf: Math.round(pf * 100) / 100,
    esi: Math.round(esi * 100) / 100,
    gross: Math.round(gross * 100) / 100,
    net: Math.round(net * 100) / 100
  };
};

export const calculateTax = (income, financialYear = '2024-25') => {
  const taxableIncome = parseFloat(income) || 0;
  let tax = 0;

  if (financialYear === '2024-25') {
    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 140000 + (taxableIncome - 1500000) * 0.30;
    }
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;

  logger.info('Tax calculated', { income: taxableIncome, tax: Math.round(totalTax), financialYear });

  return {
    grossIncome: taxableIncome,
    tax: Math.round(tax * 100) / 100,
    cess: Math.round(cess * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    netIncome: Math.round((taxableIncome - totalTax) * 100) / 100
  };
};

export const calculateLeaveDeduction = (salary, days) => {
  const monthlySalary = parseFloat(salary) || 0;
  const leaveDays = parseInt(days) || 0;

  if (leaveDays <= 0) {
    return { deduction: 0 };
  }

  const workingDaysPerMonth = 26;
  const dailyRate = monthlySalary / workingDaysPerMonth;
  const deduction = dailyRate * leaveDays;

  logger.info('Leave deduction calculated', { monthlySalary, leaveDays, deduction });

  return {
    monthlySalary,
    leaveDays,
    dailyRate: Math.round(dailyRate * 100) / 100,
    deduction: Math.round(deduction * 100) / 100
  };
};
