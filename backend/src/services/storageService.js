import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import pool from '../config/database.js';
import { ValidationError } from '../utils/errors.js';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads', 'avatars');
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// Ensure uploads directory exists on init
if (!fsSync.existsSync(UPLOAD_DIR)) {
  fsSync.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class StorageService {
  /**
   * Validate image buffer / base64 string against format & size rules.
   * @param {Buffer} buffer
   * @param {string} mimeType
   */
  static validateImageBuffer(buffer, mimeType) {
    if (!buffer || buffer.length === 0) {
      throw new ValidationError('Uploaded file is empty.');
    }
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError(`File exceeds maximum size limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
    }

    // Verify magic bytes signature
    const header = buffer.subarray(0, 4).toString('hex');
    const isJpeg = header.startsWith('ffd8ff');
    const isPng = header.startsWith('89504e47');
    const isGif = header.startsWith('47494638');
    const isWebp = buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    if (!isJpeg && !isPng && !isGif && !isWebp) {
      throw new ValidationError('Invalid image signature. Only JPEG, PNG, WEBP, and GIF images are accepted.');
    }

    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      throw new ValidationError(`Unsupported MIME type: ${mimeType}.`);
    }

    let extension = 'png';
    if (isJpeg) extension = 'jpg';
    if (isWebp) extension = 'webp';
    if (isGif) extension = 'gif';

    return { extension, size: buffer.length };
  }

  /**
   * Save Base64 data URL to disk storage and return public relative URL.
   * Automatically extracts and validates mime type & data buffer.
   * @param {string} base64Data
   * @param {string} [userId]
   * @returns {Promise<{ relativeUrl: string, filePath: string, filename: string }>}
   */
  static async saveBase64Image(base64Data, userId = 'user') {
    if (!base64Data || typeof base64Data !== 'string') {
      throw new ValidationError('Invalid image payload.');
    }

    // If it's already an existing relative URL or remote URL, return as is
    if (base64Data.startsWith('/uploads/') || base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
      return { relativeUrl: base64Data, filePath: null, filename: null };
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let buffer;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      // Raw base64 string fallback
      buffer = Buffer.from(base64Data, 'base64');
    }

    const { extension } = this.validateImageBuffer(buffer, mimeType);
    const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `avatar_${safeUserId}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filePath, buffer);
    const relativeUrl = `/uploads/avatars/${filename}`;

    return { relativeUrl, filePath, filename };
  }

  /**
   * Safely delete a local file from disk. Ignores external URLs or non-existent files.
   * @param {string} fileUrlOrPath
   */
  static async deleteLocalFile(fileUrlOrPath) {
    if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return;
    try {
      let fullPath;
      if (fileUrlOrPath.startsWith('/uploads/avatars/')) {
        const basename = path.basename(fileUrlOrPath);
        fullPath = path.join(UPLOAD_DIR, basename);
      } else if (path.isAbsolute(fileUrlOrPath)) {
        fullPath = fileUrlOrPath;
      } else {
        return; // External or unsupported
      }

      if (fsSync.existsSync(fullPath)) {
        await fs.unlink(fullPath);
      }
    } catch (err) {
      console.warn(`[StorageService] Warning: Failed to purge file ${fileUrlOrPath}:`, err.message);
    }
  }

  /**
   * Transactional update of a user's avatar with automatic purge of old avatar and rollback on failure.
   * Two-phase commit / compensatory action pattern:
   * 1. Write new avatar file to disk.
   * 2. Execute SQL UPDATE within transaction.
   * 3. Commit SQL and delete previous avatar file from disk.
   * 4. On SQL failure -> Rollback SQL and delete newly saved file to prevent orphaned files.
   *
   * @param {string} userId
   * @param {string} newAvatarData - Base64 data-URL or remote URL or null to remove
   * @returns {Promise<string|null>} updated avatar_url
   */
  static async updateUserAvatarWithRollback(userId, newAvatarData) {
    // 1. Fetch current user avatar for safe deletion upon commit
    const [rows] = await pool.query('SELECT avatar_url FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      throw new ValidationError('User not found.');
    }
    const oldAvatarUrl = rows[0].avatar_url;

    let newSavedFile = null;
    let finalAvatarUrl = null;

    if (newAvatarData && newAvatarData.trim() !== '') {
      if (newAvatarData.startsWith('data:')) {
        newSavedFile = await this.saveBase64Image(newAvatarData, userId);
        finalAvatarUrl = newSavedFile.relativeUrl;
      } else {
        finalAvatarUrl = newAvatarData.trim();
      }
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?', [
        finalAvatarUrl,
        userId
      ]);

      await conn.commit();

      // On successful database commit, purge the old file if it was a local upload
      if (oldAvatarUrl && oldAvatarUrl !== finalAvatarUrl) {
        await this.deleteLocalFile(oldAvatarUrl);
      }

      return finalAvatarUrl;
    } catch (dbError) {
      await conn.rollback();

      // Compensatory rollback: Delete newly written file so no orphan is left on disk
      if (newSavedFile && newSavedFile.filePath) {
        await this.deleteLocalFile(newSavedFile.filePath);
      }

      throw dbError;
    } finally {
      conn.release();
    }
  }

  /**
   * Garbage collection utility: Scan storage directory and purge orphaned files not referenced in database.
   */
  static async purgeOrphanedAvatars() {
    try {
      if (!fsSync.existsSync(UPLOAD_DIR)) return { scanned: 0, purged: 0 };
      const files = await fs.readdir(UPLOAD_DIR);
      if (files.length === 0) return { scanned: 0, purged: 0 };

      const [users] = await pool.query('SELECT avatar_url FROM users WHERE avatar_url IS NOT NULL');
      const activeUrls = new Set(users.map(u => u.avatar_url));

      let purgedCount = 0;
      for (const file of files) {
        const relative = `/uploads/avatars/${file}`;
        if (!activeUrls.has(relative)) {
          const filePath = path.join(UPLOAD_DIR, file);
          const stats = await fs.stat(filePath);
          // Only purge files older than 1 hour to prevent race conditions during in-flight uploads
          const ageHours = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
          if (ageHours > 1) {
            await fs.unlink(filePath);
            purgedCount++;
          }
        }
      }

      return { scanned: files.length, purged: purgedCount };
    } catch (err) {
      console.error('[StorageService] Garbage collection error:', err);
      return { error: err.message };
    }
  }
}

export default StorageService;
