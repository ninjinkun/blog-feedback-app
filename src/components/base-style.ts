import { createGlobalStyle } from 'styled-components';
import { UAParser } from 'ua-parser-js';
import { colors, fontFamily } from './properties';

const parser = new UAParser();
const result = parser.getResult();
// Android Chrome kills their "pull to refresh" when overscroll-behavior-y is none.
const isAndroidChrome = result.browser.name === 'Chrome' && result.os.name === 'Android';

export const GlobalStyle = createGlobalStyle`
  html {
    width: 100%;
    height: 100%;
  }
  body {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overscroll-behavior-y: ${isAndroidChrome ? 'auto' : 'none'};
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    margin: 0;      
  }
  #root {
    height: 100vh;
    font-family: ${fontFamily};
  }
  a {
    text-decoration: none;
  }
  a:link {
    color: ${colors.black};
  }
  a:visited {
    color: ${colors.black};
  }
`;
