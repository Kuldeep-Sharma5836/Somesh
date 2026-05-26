const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const normalizeOrigin = (baseUrl) => baseUrl.replace(/\/api\/?$/, '');

const resolveAssetUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) {
    return url;
  }

  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    const origin = normalizeOrigin(API_BASE_URL);
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${path}`;
  }

  return url;
};

export default resolveAssetUrl;
