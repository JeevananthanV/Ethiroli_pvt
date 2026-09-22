import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import { PAYMENT_STATUS, PAYMENT_METHOD } from '../config/constants.js';

export const processPayment = async (amount, method, reference, metadata = {}) => {
  logger.info('Processing payment', { amount, method, reference, metadata });

  try {
    const validMethods = Object.values(PAYMENT_METHOD);
    const normalizedMethod = validMethods.includes(method.toUpperCase()) ? method.toUpperCase() : method;

    const paymentReference = reference || `TXN-${Date.now()}`;

    const [result] = await pool.execute(
      `INSERT INTO payments (amount, payment_method, method, reference, status, metadata, created_at)
       VALUES (?, ?, ?, ?, 'PENDING', ?, CURRENT_TIMESTAMP)`,
      [amount, normalizedMethod, normalizedMethod, paymentReference, JSON.stringify(metadata)]
    );

    const paymentId = result.insertId;

    logger.info('Payment processed', { paymentId, amount, method: normalizedMethod, reference: paymentReference });

    return {
      success: true,
      paymentId,
      amount: parseFloat(amount),
      method: normalizedMethod,
      reference: paymentReference,
      status: 'PENDING',
      metadata,
      stateTransition: { from: null, to: 'PENDING' }
    };
  } catch (error) {
    logger.error('Payment processing failed', { error: error.message });
    throw error;
  }
};

export const completePayment = async (paymentId, metadata = {}) => {
  logger.info('Completing payment', { paymentId, metadata });

  try {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ?', [paymentId]);

    if (rows.length === 0) {
      throw new Error('Payment not found');
    }

    const payment = rows[0];

    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      throw new Error('Payment is already completed');
    }

    if (payment.status === PAYMENT_STATUS.REFUNDED) {
      throw new Error('Cannot complete a refunded payment');
    }

    const mergedMetadata = { ...(payment.metadata ? JSON.parse(payment.metadata) : {}), ...metadata };

    await pool.execute(
      'UPDATE payments SET status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [PAYMENT_STATUS.COMPLETED, JSON.stringify(mergedMetadata), paymentId]
    );

    await pool.execute(
      `INSERT INTO transactions (type, amount, payment_id, reference, notes, created_at)
       VALUES ('PAYMENT', ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [payment.amount, paymentId, payment.reference, 'Payment completed']
    );

    logger.info('Payment completed', { paymentId, amount: payment.amount });

    return {
      success: true,
      paymentId,
      amount: parseFloat(payment.amount),
      status: PAYMENT_STATUS.COMPLETED,
      reference: payment.reference,
      stateTransition: { from: payment.status, to: PAYMENT_STATUS.COMPLETED }
    };
  } catch (error) {
    logger.error('Payment completion failed', { paymentId, error: error.message });
    throw error;
  }
};

export const failPayment = async (paymentId, reason = 'Payment failed') => {
  logger.info('Failing payment', { paymentId, reason });

  try {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ?', [paymentId]);

    if (rows.length === 0) {
      throw new Error('Payment not found');
    }

    const payment = rows[0];

    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      throw new Error('Cannot fail a completed payment');
    }

    if (payment.status === PAYMENT_STATUS.REFUNDED) {
      throw new Error('Cannot fail a refunded payment');
    }

    await pool.execute(
      'UPDATE payments SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [PAYMENT_STATUS.FAILED, reason, paymentId]
    );

    logger.info('Payment failed', { paymentId, reason });

    return {
      success: true,
      paymentId,
      status: PAYMENT_STATUS.FAILED,
      reason,
      stateTransition: { from: payment.status, to: PAYMENT_STATUS.FAILED }
    };
  } catch (error) {
    logger.error('Payment failure failed', { paymentId, error: error.message });
    throw error;
  }
};

export const refundPayment = async (paymentId, amount, reason = 'Refund requested') => {
  logger.info('Processing refund', { paymentId, amount, reason });

  try {
    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ?', [paymentId]);

    if (rows.length === 0) {
      throw new Error('Payment not found');
    }

    const payment = rows[0];

    if (payment.status !== PAYMENT_STATUS.COMPLETED) {
      throw new Error(`Cannot refund payment with status: ${payment.status}`);
    }

    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new Error('Refund amount exceeds original payment amount');
    }

    const isPartial = refundAmount < payment.amount;

    await pool.execute(
      'UPDATE payments SET status = ?, refunded_at = CURRENT_TIMESTAMP, refund_amount = ?, notes = ? WHERE id = ?',
      [PAYMENT_STATUS.REFUNDED, refundAmount, reason, paymentId]
    );

    await pool.execute(
      `INSERT INTO transactions (type, amount, payment_id, reference, notes, created_at)
       VALUES ('REFUND', ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [refundAmount, paymentId, `REFUND-${Date.now()}`, `${reason}${isPartial ? ' (partial)' : ''}`]
    );

    logger.info('Refund processed', { paymentId, refundAmount, isPartial });

    return {
      success: true,
      paymentId,
      refundAmount: parseFloat(refundAmount),
      isPartial,
      stateTransition: { from: PAYMENT_STATUS.COMPLETED, to: PAYMENT_STATUS.REFUNDED }
    };
  } catch (error) {
    logger.error('Refund processing failed', { paymentId, error: error.message });
    throw error;
  }
};

export const verifyPayment = async (transactionId) => {
  logger.info('Verifying payment', { transactionId });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM payments WHERE reference = ? OR id = ?',
      [transactionId, transactionId]
    );

    if (rows.length === 0) {
      return { success: false, message: 'Payment not found', transactionId };
    }

    const payment = rows[0];

    return {
      success: payment.status === PAYMENT_STATUS.COMPLETED,
      status: payment.status,
      amount: parseFloat(payment.amount),
      method: payment.method,
      reference: payment.reference,
      transactionId: payment.id,
      createdAt: payment.created_at
    };
  } catch (error) {
    logger.error('Payment verification failed', { transactionId, error: error.message });
    throw error;
  }
};
