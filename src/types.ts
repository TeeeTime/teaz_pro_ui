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

export interface ProgressRow {
  label: string
  /** 0-100; values outside are clamped. */
  percent: number
}

export interface StatusRow {
  label: string
  state: 'good' | 'warning' | 'critical'
  /** Short extra text after the state word, e.g. "(1/2)" for running/total. */
  detail?: string
}
