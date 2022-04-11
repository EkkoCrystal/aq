import defaultSettings from '@/settings'

const title = defaultSettings.title || '艾康防疫管控'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
