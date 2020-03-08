import 'normalize.css'
import '../styles/index.styl'

export default function MyApp({ Component, pageProps }) {
  console.log("haha")
  return <Component {...pageProps} />
}