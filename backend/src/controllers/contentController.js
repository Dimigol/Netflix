import Content from '../models/Content.js';
import WatchHistory from '../models/WatchHistory.js';

const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/watch?v=7RUA0IOfar8';
const DEFAULT_YOUTUBE_ID = '7RUA0IOfar8';
const FALLBACK_YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=qIYyXcCwvKc',
  'https://www.youtube.com/watch?v=cXg62-t8BWs',
  'https://www.youtube.com/watch?v=zckJCxYxn1g',
  'https://www.youtube.com/watch?v=SaHZHU-44XA',
  'https://www.youtube.com/watch?v=HhesaQXLuRY',
  'https://www.youtube.com/watch?v=oVzVdvGIC7U',
  'https://www.youtube.com/watch?v=JWtnJjn6ng0',
  'https://www.youtube.com/watch?v=tNcDHWpselE',
  'https://www.youtube.com/watch?v=faJAT35j5Ss',
  'https://www.youtube.com/watch?v=SS6ABPkfmBE',
  'https://www.youtube.com/watch?v=5llvd1Uu-iU',
  'https://www.youtube.com/watch?v=wmiIUN-7qhE',
  'https://www.youtube.com/watch?v=V6wWKNij_1M',
  'https://www.youtube.com/watch?v=tiVNk6_0GdY',
  'https://www.youtube.com/watch?v=bLvqoHBptjg',
  'https://www.youtube.com/watch?v=sY1S34973zA',
  'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  'https://www.youtube.com/watch?v=gCcx85zbxz4',
  'https://www.youtube.com/watch?v=C0BMx-qxsP4',
  'https://www.youtube.com/watch?v=EXeTwQWrcwY'
];
const BROKEN_YOUTUBE_IDS = new Set([
  'zSID6l0v0A0',
  '8zc8AgHUk-8',
  'n9xhJsXlVc0',
  '8ugrtQSXFOM',
  'b9ncK3X7kAw',
  'T7eY-NNkHLc',
  '0tPAGqI0ae0',
  'PKFxCpqwnFQ',
  'gwktIsnNi6E',
  'F6P_v3XKc9E',
  's7EdQ4FqJDE',
  'CHalMy3OL-U',
  'M9qg8k0ZvQo',
  '0G-lbJbYNCk',
  '_nLAzRY3F0c',
  'WDkg3h8PHMU',
  'xjDODtChtcE',
  'uYPbbksJxIE',
  'hZJYeoPRXNQ',
  '0Z0yulnAzj0',
  'K87FpiP1H1w',
  'Ki8jJnY9z88',
  'TWT-AcvS74c',
  'TykMhC6OfBk',
  'qSqQvBTC3lA',
  '0bBPJR0CbpA',
  'Z1BCujX3wME',
  'S2yrjudt0m8',
  '7z_9LLWFLug',
  'qeW5fZ4Z3qM',
  'k9aVkJg0gZE',
  'XYGzRB4Pnq8',
  '5eV6uF72Z5M'
]);

function getYouTubeId(url = '') {
  if (!url) {
    return DEFAULT_YOUTUBE_ID;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v') || DEFAULT_YOUTUBE_ID;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    return pathParts.at(-1) || DEFAULT_YOUTUBE_ID;
  } catch {
    return DEFAULT_YOUTUBE_ID;
  }
}

function getYouTubeThumbnail(url) {
  return `https://i.ytimg.com/vi/${getYouTubeId(url)}/hqdefault.jpg`;
}

function hashString(value = '') {
  return Array.from(value).reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 0);
}

function getFallbackYouTubeUrl(item = {}) {
  const seed = `${item.title || ''}:${item.category || ''}`;
  return FALLBACK_YOUTUBE_URLS[hashString(seed) % FALLBACK_YOUTUBE_URLS.length] || DEFAULT_YOUTUBE_URL;
}

function getSafeYouTubeUrl(url, item) {
  const videoId = getYouTubeId(url);
  return BROKEN_YOUTUBE_IDS.has(videoId) ? getFallbackYouTubeUrl(item) : (url || getFallbackYouTubeUrl(item));
}

function isLocalImage(image = '') {
  return image.startsWith('/assets/') || image.startsWith('assets/');
}

function normalizeContent(content) {
  const item = typeof content.toObject === 'function' ? content.toObject() : { ...content };
  const youtubeUrl = getSafeYouTubeUrl(item.youtubeUrl || item.youtube, item);
  const genres = Array.isArray(item.genres) && item.genres.length
    ? item.genres
    : [item.category].filter(Boolean);
  const image = isLocalImage(item.image || item.img) ? (item.image || item.img) : getYouTubeThumbnail(youtubeUrl);

  return {
    ...item,
    youtubeUrl,
    youtube: youtubeUrl,
    image,
    img: image,
    genres,
    description: item.description || `Assista ${item.title || 'este titulo'} no catalogo.`
  };
}

export const getAllContent = async (req, res, next) => {
  try {
    const { category, limit = 50 } = req.query;
    const query = category ? { category } : {};
    const safeLimit = Number.parseInt(limit, 10) || 50;

    const content = await Content.find(query).limit(safeLimit);
    res.json(content.map(normalizeContent));
  } catch (err) {
    next(err);
  }
};

export const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(normalizeContent(content));
  } catch (err) {
    next(err);
  }
};

export const searchContent = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await Content.find({
      $text: { $search: q }
    }).limit(20);

    res.json(results.map(normalizeContent));
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userWatchHistory = await WatchHistory.find({ userId: req.userId });

    if (userWatchHistory.length === 0) {
      const randomContent = await Content.aggregate([
        { $sample: { size: 10 } }
      ]);
      return res.json(randomContent.map(normalizeContent));
    }

    const categories = new Set();
    const tags = new Set();

    const watchedContent = await Content.find({
      _id: { $in: userWatchHistory.map(w => w.contentId) }
    });

    watchedContent.forEach(content => {
      if (content.category) categories.add(content.category);
      if (content.tags) content.tags.forEach(tag => tags.add(tag));
    });

    const recommendations = await Content.find({
      $or: [
        { category: { $in: Array.from(categories) } },
        { tags: { $in: Array.from(tags) } }
      ],
      _id: { $nin: userWatchHistory.map(w => w.contentId) }
    }).limit(10);

    res.json(recommendations.map(normalizeContent));
  } catch (err) {
    next(err);
  }
};
