export interface AppStat {
  value: string
  deltaLabel: string
  deltaGood: boolean
  /** 12-point trend, oldest first. */
  trend: number[]
}

export interface AgendaEvent {
  time: string
  title: string
}

export interface StatusRow {
  label: string
  state: 'good' | 'warning' | 'critical'
}
