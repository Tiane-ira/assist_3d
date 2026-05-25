import moment from 'moment'

export const formatDate = (date: Date | string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return moment(new Date(date).getTime()).format(format)
}
