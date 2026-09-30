/**
 * State Synchronization Utility
 * Enables real-time state sync across multiple browser tabs
 * Used for PM Dashboard, KPIs, and project states
 */

export const syncState = (channelName, data) => {
  // BroadcastChannel for same-origin tabs
  const channel = new BroadcastChannel(`pm_${channelName}`)

  // Send state to all open tabs
  channel.postMessage(data)

  // Also store in localStorage for fallback (cross-session)
  try {
    localStorage.setItem(`pm_${channelName}_data`, JSON.stringify(data))
  } catch (e) {
    console.warn('localStorage not available', e)
  }

  // Listen for changes from other tabs
  const handleMessage = (event) => {
    const data = event.data
    if (data && data.type && data.state) {
      // Dispatch custom event for components to react
      window.dispatchEvent(new CustomEvent(`pm:${channelName}:update`, {
        detail: {
          type: data.type,
          state: data.state,
          timestamp: data.timestamp || new Date().toISOString()
        }
      }))
    }
  }

  channel.onmessage = handleMessage

  // Return cleanup function
  return () => {
    channel.onmessage = null
    try {
      channel.close()
    } catch (e) {
      // Channel might already be closed
    }
  }
}