export const calculateSalaryComponents = (basicSalary) => {
  const basic = parseFloat(basicSalary);
  const hra = basic * 0.40;
  const da = basic * 0.10;
  const pf = basic * 0.12;
  const esi = basic * 0.0075;
  return { basic, hra, da, pf, esi };
};
