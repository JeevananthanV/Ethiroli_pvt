import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteLoader from '../../common/components/RouteLoader/RouteLoader.jsx';
import VideoEditorDashboard from '../VideoEditorDashboard.jsx';
import MyVideoTasks from '../pages/MyVideoTasks.jsx';
import AllProjects from '../pages/AllProjects.jsx';
import DailyWorkLog from '../pages/DailyWorkLog.jsx';
import TimeTracker from '../pages/TimeTracker.jsx';
import ReviewRevisions from '../pages/ReviewRevisions.jsx';
import MediaLibrary from '../pages/MediaLibrary.jsx';
import CalendarDeadlines from '../pages/CalendarDeadlines.jsx';
import PerformanceReports from '../pages/PerformanceReports.jsx';
import VideoProfile from '../pages/VideoProfile.jsx';

// Lazy-loaded Video Pages
const VideoEditorDashboardLazy = lazy(() => import('../VideoEditorDashboard.jsx'));
const MyVideoTasksLazy = lazy(() => import('../pages/MyVideoTasks.jsx'));
const AllProjectsLazy = lazy(() => import('../pages/AllProjects.jsx'));
const DailyWorkLogLazy = lazy(() => import('../pages/DailyWorkLog.jsx'));
const TimeTrackerLazy = lazy(() => import('../pages/TimeTracker.jsx'));
const ReviewRevisionsLazy = lazy(() => import('../pages/ReviewRevisions.jsx'));
const MediaLibraryLazy = lazy(() => import('../pages/MediaLibrary.jsx'));
const CalendarDeadlinesLazy = lazy(() => import('../pages/CalendarDeadlines.jsx'));
const PerformanceReportsLazy = lazy(() => import('../pages/PerformanceReports.jsx'));
const VideoProfileLazy = lazy(() => import('../pages/VideoProfile.jsx'));

export default function VideoRoutes() {
  return (
    <Suspense fallback={<RouteLoader label="Loading video portal..." />>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VideoEditorDashboardLazy />} />
        <Route path="my-tasks" element={<MyVideoTasksLazy />} />
        <Route path="all-projects" element={<AllProjectsLazy />} />
        <Route path="daily-log/:taskId?" element={<DailyWorkLogLazy />} />
        <Route path="time-tracker" element={<TimeTrackerLazy />} />
        <Route path="review-revisions/:taskId?" element={<ReviewRevisionsLazy />} />
        <Route path="media-library" element={<MediaLibraryLazy />} />
        <Route path="calendar" element={<CalendarDeadlinesLazy />} />
        <Route path="performance-reports" element={<PerformanceReportsLazy />} />
        <Route path="profile" element={<VideoProfileLazy />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}