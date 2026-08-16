import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://gqlcxvukyezqpdftjdeo.supabase.co',
  'sb_publishable_ViHQ2SZREPXE_GCrN_zDrw__kXoN9D8'
);

const SESSION_KEY = 'odoVisitSessionId';
const VISITOR_KEY = 'odoVisitorId';
const COUNT_KEY = 'odoVisitCount';
const LANDING_KEY = 'odoLandingPath';

function getOrCreate(key, factory) {
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const value = factory();
    localStorage.setItem(key, value);
    return value;
  } catch {
    return factory();
  }
}

function uuid() {
  return globalThis.crypto?.randomUUID?.() || `odo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function deviceType() {
  const w = Math.min(window.innerWidth || 0, screen.width || 0);
  if (/Mobi|Android/i.test(navigator.userAgent) || w < 768) return 'mobile';
  if (/Tablet|iPad/i.test(navigator.userAgent) || w < 1024) return 'tablet';
  return 'desktop';
}

function browser() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  if (/Firefox\//.test(ua)) return 'Firefox';
  return 'Other';
}

function os() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function trafficSource(url) {
  const params = new URL(url).searchParams;
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  if (utmSource) return { source: utmSource, medium: utmMedium || 'unknown', campaign: utmCampaign || '' };
  const ref = document.referrer;
  if (!ref) return { source: 'direct', medium: 'none', campaign: '' };
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (host.includes('google.')) return { source: 'google', medium: 'organic', campaign: '' };
    if (host.includes('facebook.com') || host.includes('instagram.com')) return { source: 'meta', medium: 'social', campaign: '' };
    if (host.includes('youtube.com') || host.includes('youtu.be')) return { source: 'youtube', medium: 'social', campaign: '' };
    return { source: host, medium: 'referral', campaign: '' };
  } catch {
    return { source: 'referral', medium: 'referral', campaign: '' };
  }
}

async function track() {
  const url = location.href;
  const sessionId = getOrCreate(SESSION_KEY, uuid);
  const visitorId = getOrCreate(VISITOR_KEY, uuid);
  const landingPath = getOrCreate(LANDING_KEY, () => `${location.pathname}${location.search}`);
  let visitNumber = Number(localStorage.getItem(COUNT_KEY) || '0') + 1;
  try { localStorage.setItem(COUNT_KEY, String(visitNumber)); } catch {}

  const traffic = trafficSource(url);
  const { data: { session } } = await supabase.auth.getSession();

  await supabase.from('site_visits').insert({
    session_id: sessionId,
    visitor_id: visitorId,
    user_id: session?.user?.id || null,
    page_path: `${location.pathname}${location.hash || ''}`,
    page_title: document.title,
    referrer: document.referrer || null,
    source: traffic.source,
    medium: traffic.medium,
    campaign: traffic.campaign || null,
    landing_path: landingPath,
    device_type: deviceType(),
    browser: browser(),
    os: os(),
    language: navigator.language || null,
    screen_width: window.innerWidth || null,
    screen_height: window.innerHeight || null,
    visit_number: visitNumber
  });
}

track().catch(() => {});
