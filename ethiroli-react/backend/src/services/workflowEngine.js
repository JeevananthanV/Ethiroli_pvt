import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const executeWorkflow = async (workflowId, context) => {
  logger.info('Executing workflow', { workflowId });

  try {
    const [workflowRows] = await pool.execute(
      'SELECT * FROM workflows WHERE id = ? AND is_active = TRUE',
      [workflowId]
    );

    if (workflowRows.length === 0) {
      throw new Error('Workflow not found or inactive');
    }

    const workflow = workflowRows[0];

    const [execution] = await pool.execute(
      'INSERT INTO workflow_executions (workflow_id, context, status, started_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [workflowId, JSON.stringify(context || {}), 'RUNNING']
    );

    const executionId = execution.insertId;

    try {
      const [nodes] = await pool.execute(
        'SELECT * FROM workflow_nodes WHERE workflow_id = ? ORDER BY sort_order ASC',
        [workflowId]
      );

      let currentContext = { ...context };
      let currentNode = nodes.find(n => n.type === 'START');

      while (currentNode) {
        currentContext = await executeNode(currentNode, currentContext);

        const nextNode = nodes.find(n => n.id === currentNode.next_node_id);
        currentNode = nextNode;
      }

      await pool.execute(
        'UPDATE workflow_executions SET status = ?, completed_at = CURRENT_TIMESTAMP, output = ? WHERE id = ?',
        ['COMPLETED', JSON.stringify(currentContext), executionId]
      );

      logger.info('Workflow executed successfully', { workflowId, executionId });

      return {
        success: true,
        workflowId,
        executionId,
        status: 'COMPLETED',
        output: currentContext
      };
    } catch (nodeError) {
      await pool.execute(
        'UPDATE workflow_executions SET status = ?, error = ? WHERE id = ?',
        ['FAILED', nodeError.message, executionId]
      );

      logger.error('Workflow execution failed at node', { workflowId, executionId, error: nodeError.message });
      throw nodeError;
    }
  } catch (error) {
    logger.error('Workflow execution failed', { workflowId, error: error.message });
    throw error;
  }
};

export const executeNode = async (node, context) => {
  logger.info('Executing workflow node', { nodeId: node.id, nodeType: node.type });

  switch (node.type) {
    case 'START':
      return context;

    case 'ACTION':
      const actionType = node.config?.action;
      if (actionType === 'send_email') {
        const { sendNotification } = await import('./emailService.js');
        await sendNotification(node.config.recipient, node.config.subject, node.config.body);
      } else if (actionType === 'send_sms') {
        const { sendSMS } = await import('./smsService.js');
        await sendSMS(node.config.recipient, node.config.body);
      } else if (actionType === 'webhook') {
        const { dispatch } = await import('./webhookDispatcher.js');
        await dispatch(node.config.event, node.config.payload);
      }
      return { ...context, lastNodeResult: 'action_executed' };

    case 'CONDITION':
      const conditionMet = evaluateCondition(node.config, context);
      return { ...context, conditionMet };

    case 'APPROVAL':
      const approvalStatus = node.config?.requiredApproval === 'SINGLE' ? 'PENDING' : 'PENDING';
      await pool.execute(
        `INSERT INTO approval_instances (workflow_node_id, workflow_execution_id, status, data, created_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [node.id, context.executionId, approvalStatus, JSON.stringify(context)]
      );
      return { ...context, approvalStatus };

    case 'END':
      return { ...context, finishedAt: new Date().toISOString() };

    default:
      logger.warn('Unknown node type', { nodeType: node.type });
      return context;
  }
};

const evaluateCondition = (config, context) => {
  const { field, operator, value } = config;
  const actualValue = context[field];

  switch (operator) {
    case 'eq': return actualValue === value;
    case 'ne': return actualValue !== value;
    case 'gt': return actualValue > value;
    case 'lt': return actualValue < value;
    case 'gte': return actualValue >= value;
    case 'lte': return actualValue <= value;
    case 'in': return Array.isArray(value) && value.includes(actualValue);
    case 'exists': return actualValue !== undefined && actualValue !== null;
    default: return false;
  }
};
