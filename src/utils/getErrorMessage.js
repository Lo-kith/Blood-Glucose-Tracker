const FALLBACK_MESSAGE = 'Something went wrong.';

/**
 * Pulls a readable message out of the three error shapes the API can send.
 * Always returns a string so the UI never shows an empty red box.
 */
export default function getErrorMessage(error) {
  const data = error?.response?.data;

  // Shape 1: { error: { message, field } }
  if (data?.error?.message) {
    return data.error.message;
  }

  // Shape 2: { success: false, message }
  if (data?.message) {
    return data.message;
  }

  // Shape 3: { success: false, errors: { field: ["message"] } }
  if (data?.errors && typeof data.errors === 'object') {
    for (const fieldMessages of Object.values(data.errors)) {
      if (Array.isArray(fieldMessages) && fieldMessages[0]) {
        return fieldMessages[0];
      }
      if (typeof fieldMessages === 'string' && fieldMessages) {
        return fieldMessages;
      }
    }
  }

  return FALLBACK_MESSAGE;
}
