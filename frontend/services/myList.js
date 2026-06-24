import api from './api.js';

export function getContentId(item = {}) {
  return item._id || item.id || item.contentId?._id || item.contentId;
}

export function isBookmarked(item = {}) {
  return Boolean(item.isBookmarked);
}

export async function setBookmark(item, isBookmarkedValue) {
  const contentId = getContentId(item);

  if (!contentId) {
    throw new Error('Não foi possível identificar este título.');
  }

  const result = await api.updateBookmark(contentId, isBookmarkedValue);

  item.isBookmarked = isBookmarkedValue;
  window.dispatchEvent(new CustomEvent('my-list-updated', {
    detail: { contentId, isBookmarked: isBookmarkedValue, item }
  }));

  return result;
}

export async function toggleBookmark(item) {
  const nextValue = !isBookmarked(item);
  await setBookmark(item, nextValue);
  return nextValue;
}
