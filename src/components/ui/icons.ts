// Core Icons (used in initial render)
export { default as Building2 } from 'lucide-react/dist/esm/icons/building-2'
export { default as Ticket } from 'lucide-react/dist/esm/icons/ticket'
export { default as User } from 'lucide-react/dist/esm/icons/user'
export { default as Search } from 'lucide-react/dist/esm/icons/search'
export { default as X } from 'lucide-react/dist/esm/icons/x'

// Dynamically imported icons (used after initial render)
export const getActionIcons = () => ({
  ChevronLeft: () => import('lucide-react/dist/esm/icons/chevron-left'),
  ChevronRight: () => import('lucide-react/dist/esm/icons/chevron-right'),
  ChevronDown: () => import('lucide-react/dist/esm/icons/chevron-down'),
  Plus: () => import('lucide-react/dist/esm/icons/plus'),
  Minus: () => import('lucide-react/dist/esm/icons/minus'),
  Share2: () => import('lucide-react/dist/esm/icons/share-2'),
  Settings: () => import('lucide-react/dist/esm/icons/settings'),
  Info: () => import('lucide-react/dist/esm/icons/info')
})

export const getFeatureIcons = () => ({
  Star: () => import('lucide-react/dist/esm/icons/star'),
  Heart: () => import('lucide-react/dist/esm/icons/heart'),
  Clock: () => import('lucide-react/dist/esm/icons/clock'),
  Users: () => import('lucide-react/dist/esm/icons/users'),
  Music: () => import('lucide-react/dist/esm/icons/music'),
  Trophy: () => import('lucide-react/dist/esm/icons/trophy'),
  Sparkles: () => import('lucide-react/dist/esm/icons/sparkles'),
  Map: () => import('lucide-react/dist/esm/icons/map'),
  List: () => import('lucide-react/dist/esm/icons/list'),
  Bell: () => import('lucide-react/dist/esm/icons/bell'),
  CreditCard: () => import('lucide-react/dist/esm/icons/credit-card'),
  Gift: () => import('lucide-react/dist/esm/icons/gift'),
  QrCode: () => import('lucide-react/dist/esm/icons/qr-code')
}) 