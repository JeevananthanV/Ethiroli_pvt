import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import leadRoutes from './leadRoutes.js';
import feedRoutes from './feedRoutes.js';
import auditRoutes from './auditRoutes.js';
import systemRoutes from './systemRoutes.js';
import healthRoutes from './healthRoutes.js';
import roleRoutes from './roleRoutes.js';

import employeeRoutes from './employeeRoutes.js';
import internRoutes from './internRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import courseRoutes from './courseRoutes.js';
import moduleRoutes from './moduleRoutes.js';
import lessonRoutes from './lessonRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import quizRoutes from './quizRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';
import clientRoutes from './clientRoutes.js';
import subscriptionRoutes from './subscriptionRoutes.js';
import taskRoutes from './taskRoutes.js';

import transactionRoutes from './transactionRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import liveQuizRoutes from './liveQuizRoutes.js';
import forumRoutes from './forumRoutes.js';
import badgeRoutes from './badgeRoutes.js';

import communicationRoutes from './communicationRoutes.js';
import contactRoutes from './contactRoutes.js';
import templateRoutes from './templateRoutes.js';
import providerRoutes from './providerRoutes.js';
import jobRoutes from './jobRoutes.js';
import candidateRoutes from './candidateRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import integrationRoutes from './integrationRoutes.js';

import payrollRoutes from './payrollRoutes.js';
import performanceRoutes from './performanceRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import holidayRoutes from './holidayRoutes.js';
import workflowRoutes from './workflowRoutes.js';
import approvalRoutes from './approvalRoutes.js';
import companySettingRoutes from './companySettingRoutes.js';
import recurringScheduleRoutes from './recurringScheduleRoutes.js';

import jobBoardRoutes from './jobBoardRoutes.js';
import projectRoutes from './projectRoutes.js';
import mindMapRoutes from './mindMapRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import monitoringRoutes from './monitoringRoutes.js';

import tenantRoutes from './tenantRoutes.js';
import marketplaceRoutes from './marketplaceRoutes.js';
import cartRoutes from './cartRoutes.js';
import couponRoutes from './couponRoutes.js';
import reportRoutes from './reportRoutes.js';
import scheduledReportRoutes from './scheduledReportRoutes.js';
import apiKeyRoutes from './apiKeyRoutes.js';
import webhookRoutes from './webhookRoutes.js';
import orderRoutes from './orderRoutes.js';

import predictiveRoutes from './predictiveRoutes.js';
import automationRoutes from './automationRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import hrDashboardRoutes from './hrDashboardRoutes.js';
import employeeDocumentRoutes from './employeeDocumentRoutes.js';
import exitRoutes from './exitRoutes.js';
import employeePortalRoutes from './employeePortalRoutes.js';
import lmsRoutes from './lmsRoutes.js';
import operationsRoutes from './operationsRoutes.js';
import pmRoutes from './pmRoutes.js';
import financeRoutes from './financeRoutes.js';
import salesRoutes from './salesRoutes.js';
import receptionRoutes from './receptionRoutes.js';

import adminAuthRoutes from './admin/authRoutes.js';
import vendorAuthRoutes from './vendor/authRoutes.js';
import clientAuthRoutes from './client/authRoutes.js';

import adminRoutes from './admin/adminRoutes.js';
import vendorRoutes from './vendor/vendorRoutes.js';
import clientPortalRoutes from './client/clientRoutes.js';

import { resolveTenant } from '../middleware/tenantResolver.js';

const router = express.Router();

router.use(resolveTenant);

router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/leads', leadRoutes);
router.use('/v1/contact-messages', contactRoutes);
router.use('/v1/candidates', candidateRoutes);
router.use('/v1/career-applications', candidateRoutes);
router.use('/v1/jobs-board', jobBoardRoutes);
router.use('/v1/webhooks', webhookRoutes);
router.use('/v1/integrations', integrationRoutes);
router.use('/v1/activity-feed', feedRoutes);
router.use('/v1/audit-logs', auditRoutes);
router.use('/health', healthRoutes);
router.use('/v1/system', systemRoutes);
router.use('/v1/role', roleRoutes);

router.use('/v1/admin/auth', adminAuthRoutes);
router.use('/v1/vendor/auth', vendorAuthRoutes);
router.use('/v1/client/auth', clientAuthRoutes);

router.use('/v1/admin', adminRoutes);
router.use('/v1/vendor', vendorRoutes);
router.use('/v1/client', clientPortalRoutes);

router.use('/v1', employeeRoutes);
router.use('/v1', internRoutes);
router.use('/v1', attendanceRoutes);
router.use('/v1', leaveRoutes);
router.use('/v1', courseRoutes);
router.use('/v1', moduleRoutes);
router.use('/v1', lessonRoutes);
router.use('/v1', enrollmentRoutes);
router.use('/v1', quizRoutes);
router.use('/v1', assignmentRoutes);
router.use('/v1', clientRoutes);
router.use('/v1', subscriptionRoutes);
router.use('/v1', taskRoutes);

router.use('/v1', transactionRoutes);
router.use('/v1', invoiceRoutes);
router.use('/v1', paymentRoutes);
router.use('/v1', liveQuizRoutes);
router.use('/v1', forumRoutes);
router.use('/v1', badgeRoutes);

router.use('/v1', communicationRoutes);
router.use('/v1', templateRoutes);
router.use('/v1', providerRoutes);
router.use('/v1', jobRoutes);
router.use('/v1', interviewRoutes);

router.use('/v1', payrollRoutes);
router.use('/v1', performanceRoutes);
router.use('/v1', calendarRoutes);
router.use('/v1', holidayRoutes);
router.use('/v1', workflowRoutes);
router.use('/v1', approvalRoutes);
router.use('/v1', companySettingRoutes);
router.use('/v1', recurringScheduleRoutes);

router.use('/v1', jobBoardRoutes);
router.use('/v1', projectRoutes);
router.use('/v1', mindMapRoutes);
router.use('/v1', certificateRoutes);
router.use('/v1', monitoringRoutes);

router.use('/v1', tenantRoutes);
router.use('/v1', marketplaceRoutes);
router.use('/v1', cartRoutes);
router.use('/v1', couponRoutes);
router.use('/v1', reportRoutes);
router.use('/v1', scheduledReportRoutes);
router.use('/v1', apiKeyRoutes);
router.use('/v1', orderRoutes);

router.use('/v1', predictiveRoutes);
router.use('/v1', automationRoutes);
router.use('/v1', notificationRoutes);
router.use('/v1', hrDashboardRoutes);
router.use('/v1', employeeDocumentRoutes);
router.use('/v1', exitRoutes);
router.use('/v1/employee', employeePortalRoutes);
router.use('/v1/lms', lmsRoutes);
router.use('/v1/operations', operationsRoutes);
router.use('/v1/pm', pmRoutes);
router.use('/v1/finance', financeRoutes);
router.use('/v1/sales', salesRoutes);
router.use('/v1/reception', receptionRoutes);

export default router;