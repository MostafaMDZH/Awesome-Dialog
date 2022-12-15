import Head from 'next/head'
import Link from 'next/link'
import Cookies from 'universal-cookie'
import Snackbar from 'awesome-snackbar'

export default function Main(){

    //copyTextToClipboard:
    const copyTextToClipboard = text => {
        if(!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
            new Snackbar('Copied to clipboard 👍');
        }, err => new Snackbar('cannot copy 👎'));
    }
    
    //welcome snackbar:
    const cookies = new Cookies();
    setTimeout(() => {
        if(cookies.get('Sl_WelcomeSB') !== undefined) return;
        new Snackbar('Welcome to Awesome Dialog! 👋', {
            position: 'top-center',
            timeout: 2000,
            afterHide: () => {
                new Snackbar('Click on code sections to run the demo', {
                    position: 'top-center',
                    timeout: 0,
                    actionText: 'Got it',
                    onAction: () => cookies.set('Sl_WelcomeSB', 'yes', { path: '/', maxAge: 1000*24*60*60 })
                });
            }
        });
    }, 2000);

    //render:
    return (
        <div id='window' style={{scrollBehavior:'smooth'}}>

            <Head>
                <title>Awesome Dialog | React, Angular, Vue, and Typescript compatible dialog</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/* header */}
            <header id='header'>
                <Link href='https://awesome-components.com'><a className='headerLink'>Awesome Components</a></Link>
                <Link href='https://www.buymeacoffee.com/mostafamdzh'><a className='headerLink' id='coffee'>buy me a coffee! :)</a></Link>
            </header>

            <div className='container' id='intro'>

                <div id='main'>

                    {/* navigation */}
                    <div id='navigation'>
                        <div id='navigationWrapper'>
                            <a className='navLink' href='#intro'         >intro         </a>
                            <a className='navLink' href='#installation'  >installation  </a>
                            <a className='navLink' href='#title'         >title         </a>
                            <a className='navLink' href='#image-support' >image support </a>
                            <a className='navLink' href='#theme'         >theme         </a>
                            <a className='navLink' href='#custom-style'  >custom style  </a>
                            <a className='navLink' href='#on-select'     >on select     </a>
                        </div>
                    </div>

                    {/* content */}
                    <div id='content'>

                        <a href='https://github.com/MostafaMDZH/Awesome-Dialog' id='github'>Github</a>

                        {/* intro */}
                        <h3 id='awesome'><Link href='/'>Awesome</Link></h3>
                        <div id='name-versionWrapper'>
                            <h1 id='appName'><Link href='/'>Dialog</Link></h1>
                            <a id='version'>V1.0.0</a>
                        </div>
                        <p className='sectionDescription'>React, Angular, Vue, and Typescript compatible dialog</p>

                        <h3 className='sectionName' id='features'><a ># Features</a></h3>
                        <ul className='features'>
                            <li>Custom Title</li>
                            <li>Image Support</li>
                            <li>Dark/Light Theme</li>
                            <li>Custom Style</li>
                            <li>Responsive Design</li>
                            <li>Dynamic HTML</li>
                            <li>Lightweight</li>
                            <li>Zero Dependency</li>
                        </ul>

                        {/* installation */}
                        <h3 className='sectionName' id='installation'><a href='#installation'># Installation</a></h3>
                        <p className='step'><a className='bold'>{'>'} step 1 : </a>you can use either npm or yarn, or import the main file with the script tag.</p>
                        <div className='codeWrapper'>
                            <p className='comment'># npm</p>
                            <button className='codeSection copyable' onClick={()=>copyTextToClipboard('npm i awesome-dialog')}>
                                <p>npm i <span>awesome-dialog</span></p>
                            </button>
                            <p className='comment'># yarn</p>
                            <button className='codeSection copyable' onClick={()=>copyTextToClipboard('yarn add awesome-dialog')}>
                                <p>yarn add <span>awesome-dialog</span></p>
                            </button>
                            <p className='comment'>
                                # html (download the dialog.js file from the&nbsp;
                                <a href='https://github.com/MostafaMDZH/Awesome-Dialog/tree/main/src'>src</a>
                                &nbsp;directory)
                            </p>
                            <button className='codeSection copyable' onClick={()=>copyTextToClipboard('<script src="dialog.js"></script>')}>
                                <p>{"<script src=\""}<span>dialog.js</span>{"\"></script>"}</p>
                            </button>
                        </div>
                        <p className='step'><a className='bold'>{'>'} step 2 : </a>include the package in your code:</p>
                        <div className='codeWrapper'>
                            <p className='comment'># npm and yarn</p>
                            <button className='codeSection copyable' onClick={()=>copyTextToClipboard('import Dialog from \'awesome-dialog\'')}>
                                <p>import <span>Dialog</span> from <span>&apos;awesome-dialog&apos;</span></p>
                            </button>
                        </div>
                        <p className='step'><a className='bold'>{'>'} step 3 : </a>start making dialogs!</p>
                        <div className='codeWrapper'>
                            <button className='codeSection executable'
                                onClick={() => {
                                    new Dialog({
                                        isSearchable: true,
                                        searchPlaceholder: 'Search languages...',
                                        options: data.allLanguages,
                                        currentOptionId: 'en'
                                    });
                                }}>
                                <p><span>new Dialog</span>{"({ ... some options ... });"}</p>
                            </button>
                        </div>

                        






                    </div>

                </div>

            </div>

            {/* footer */}
            <footer id='footer'>
                <p>Made with ♡ by <a href='https://github.com/MostafaMDZH'>Mostafa Mohammadzadeh</a></p>
                <p id='dash'>-</p>
                <p id='githubLink'>Source on <a href='https://github.com/MostafaMDZH/Awesome-Dialog'>Github</a></p>
                <p id='awesomeComponents'>From <Link href='https://awesome-components.com'><a>Awesome Components</a></Link></p>
            </footer>

        </div>
    )
}