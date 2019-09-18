import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CalcTimeMixin extends Vue {
  getCalcTime(time: Date): string {
    const MINUTE = 1000 * 60
    const HOUR = MINUTE * 60
    const DAY = HOUR * 24
    const MONTH = DAY * 30
    const YEAR = MONTH * 12

    const created = time.getTime()
    const now = new Date().getTime()

    const diff = now - created
    let type: string = ''

    /* tslint:disable:curly align */
    if (diff >= MINUTE)
      if (diff >= HOUR)
        if (diff >= DAY)
          if (diff >= MONTH)
            if (diff >= YEAR)
              type = 'year'
            else type = 'month'
          else type = 'day'
        else type = 'hour'
      else type = 'minute'
    else type = 'second'

    let diffType: number
    switch (type) {
      case 'second':
        diffType = diff / 1000
        break
      case 'minute':
        diffType = diff / MINUTE
        break
      case 'hour':
        diffType = diff / HOUR
        break
      case 'day':
        diffType = diff / DAY
        break
      case 'month':
        diffType = diff / MONTH
        break
      case 'year':
        diffType = diff / YEAR
        break
      default:
        diffType = -1
        break
    }
    if (diffType < 5 && type === 'second') {
      return 'Now'
    }
    return `${diffType.toFixed()} ${type}${diffType > 1 ? 's' : ''} ago`
  }
}
