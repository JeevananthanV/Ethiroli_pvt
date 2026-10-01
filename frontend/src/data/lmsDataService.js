/**
 * Ethiroli Large-Scale LMS Data Service
 * Provides centralized querying, caching, and state synchronization for
 * enterprise courses, curriculum phases, question banks, and learning assets.
 */

import lmsData from './lmsData.json';
import lmsApi from '../services/api/lmsApi.js';
import { getMyEnrollments } from '../services/api/enrollmentApi.js';

class LMSDataService {
  constructor() {
    this.localData = lmsData;
    this.cacheKey = 'ethiroli_lms_state_v3';
    this.initLocalStorage();
  }

  initLocalStorage() {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (!stored) {
        localStorage.setItem(this.cacheKey, JSON.stringify(this.localData));
      }
    } catch {
      // Ignore local storage security or storage quota restrictions
    }
  }

  getStore() {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback to static JSON
    }
    return this.localData;
  }

  setStore(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(data));
    } catch {
      // fallback
    }
  }

  /**
   * Get all courses with phases, modules and day lessons
   */
  async getCourses() {
    try {
      const apiEnrollments = await getMyEnrollments().catch(() => []);
      if (Array.isArray(apiEnrollments) && apiEnrollments.length > 0) {
        return this.getStore().courses.map((c, idx) => ({
          ...c,
          ...apiEnrollments[idx],
          name: apiEnrollments[idx]?.course_name || c.name,
          progress_percentage: apiEnrollments[idx]?.progress_percentage ?? 68,
        }));
      }
    } catch (e) {
      console.warn('LMSDataService.getCourses fallback:', e);
    }
    return this.getStore().courses;
  }

  /**
   * Get Course by ID with deep phase and module tree
   */
  getCourseById(courseId) {
    const store = this.getStore();
    return store.courses.find((c) => c.id === courseId || c.code === courseId) || store.courses[0];
  }

  /**
   * Get Question Bank by Category & Difficulty
   */
  getQuestionBank(category = 'ALL', difficulty = 'ALL') {
    const questions = this.getStore().questionBank || [];
    return questions.filter((q) => {
      const matchCat = category === 'ALL' || q.category === category;
      const matchDiff = difficulty === 'ALL' || q.difficulty === difficulty;
      return matchCat && matchDiff;
    });
  }

  /**
   * Get Live Classes
   */
  getLiveClasses() {
    return this.getStore().liveClasses || [];
  }

  /**
   * Get Learning Resources
   */
  getResources() {
    return this.getStore().resources || [];
  }

  /**
   * Get Placement Opportunities
   */
  getCareerOpportunities() {
    return this.getStore().careerOpportunities || [];
  }

  /**
   * Update student lesson progress
   */
  updateDayProgress(courseId, dayNumber, completed = true) {
    const store = this.getStore();
    const course = store.courses.find((c) => c.id === courseId);
    if (course) {
      course.currentDay = Math.max(course.currentDay || 1, dayNumber + (completed ? 1 : 0));
      course.progress_percentage = Math.min(100, Math.round((course.currentDay / (course.totalDays || 32)) * 100));
      this.setStore(store);
    }
    return course;
  }
}

export const lmsDataService = new LMSDataService();
export default lmsDataService;
