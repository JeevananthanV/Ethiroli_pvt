import axiosInstance from './axiosInstance.js';

// The backend mounts the feed router at /v1/activity-feed, not /v1/feed.
// Requesting /v1/feed matched no route, fell through to studentRoutes' blanket
// role gate and came back as a 403 on every page load.
export const getFeed = async () => {
  const response = await axiosInstance.get('/v1/activity-feed');
  return response.data;
};

export const markRead = async (id) => {
  // The route is a PATCH, not a POST.
  const response = await axiosInstance.patch(`/v1/activity-feed/${id}/read`);
  return response.data;
};

export const markAllRead = async () => {
  const response = await axiosInstance.post('/v1/activity-feed/read-all');
  return response.data;
};

// FeedSidebar.jsx consumes this as `feedApi`, which was never exported and was
// therefore undefined at runtime.
export const feedApi = {
  getAll: getFeed,
  markRead,
  markAllRead,
  // The backend feed exposes read state only - likes and comments are not
  // part of this router. Kept so the sidebar degrades quietly instead of
  // throwing on a missing method.
  like: async () => null,
  comment: async () => null
};

export default feedApi;
