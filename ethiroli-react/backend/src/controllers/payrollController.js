import Payroll from '../models/Payroll.js';
import SalaryStructure from '../models/SalaryStructure.js';

export const listSalaryStructures = async (req, res) => {
  try {
    const active = await SalaryStructure.findActiveByEmployeeId(req.query.employee_id);
    res.status(200).json(active ? [active] : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSalaryStructure = async (req, res) => {
  try {
    const id = await SalaryStructure.create(req.body);
    res.status(201).json({ message: 'Salary structure created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const processPayroll = async (req, res) => {
  try {
    const { employee_id, month_year, basic, hra, da = 0, pf_employee = 0, pf_employer = 0, esi_employee = 0, esi_employer = 0, tds = 0 } = req.body;
    const gross = parseFloat(basic) + parseFloat(hra) + parseFloat(da);
    const totalDeductions = parseFloat(pf_employee) + parseFloat(esi_employee) + parseFloat(tds);
    const net = gross - totalDeductions;

    const id = await Payroll.create({
      employee_id, month_year, basic, hra, da,
      pf_employee, pf_employer, esi_employee, esi_employer, tds,
      gross_salary: gross, net_salary: net, total_deductions: totalDeductions,
      status: 'PROCESSED'
    });
    res.status(201).json({ message: 'Payroll processed.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPayrollHistory = async (req, res) => {
  try {
    const list = await Payroll.list({ employee_id: req.query.employee_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
