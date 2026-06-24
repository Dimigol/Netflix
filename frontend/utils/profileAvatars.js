export const PROFILE_AVATARS = [
  '/assets/images/Perfil-1.png',
  '/assets/images/Perfil-2.png',
  '/assets/images/Perfil-3.png',
  '/assets/images/Perfil-4.png',
  '/assets/images/Perfil-5.svg',
  '/assets/images/Perfil-6.svg',
  '/assets/images/Perfil-7.svg',
  '/assets/images/Perfil-8.svg',
  '/assets/images/Perfil-9.svg',
  '/assets/images/Perfil-10.svg'
];

function hashString(value = '') {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function pickProfileAvatar(seed = '') {
  return PROFILE_AVATARS[hashString(seed) % PROFILE_AVATARS.length];
}

export function resolveProfileAvatar(profile, index = 0) {
  if (PROFILE_AVATARS.includes(profile?.avatar)) {
    return profile.avatar;
  }

  return pickProfileAvatar(`${profile?._id ?? ''}${profile?.name ?? ''}${index}`);
}
