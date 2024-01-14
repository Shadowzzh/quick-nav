const isPro = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

export const ENV = {
  mode: process.env.NODE_ENV,
  isPro,
  isDev,
}
