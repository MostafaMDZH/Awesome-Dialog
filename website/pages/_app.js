import '../styles/index.scss'
import '../styles/main.scss'
import '../styles/main.responsive.scss'
import '../node_modules/awesome-dialog/src/dialog.scss' //uncomment at dev mode

export default function MyApp({ Component, pageProps }){
    return <Component {...pageProps} />
}