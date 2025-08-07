import {
  type Icon as LucideIcon,
  Navigation,
  LayoutDashboard,
  Route,
  MapPin,
  Truck,
  UsersRound,
  Loader2,
  LogOut,
  PlusCircle,
  MoreHorizontal,
  FileText,
  AlertCircle
} from 'lucide-react'

export type Icon = typeof LucideIcon

export const Icons = {
  logo: Navigation,
  dashboard: LayoutDashboard,
  route: Route,
  address: MapPin,
  fleet: Truck,
  customers: UsersRound,
  spinner: Loader2,
  logout: LogOut,
  add: PlusCircle,
  more: MoreHorizontal,
  invoice: FileText,
  issue: AlertCircle,
}
