import {
  type Icon as LucideIcon,
  Orbit,
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
  AlertCircle,
  Database
} from 'lucide-react'

export type Icon = typeof LucideIcon

export const Icons = {
  logo: Orbit,
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
  database: Database,
}
