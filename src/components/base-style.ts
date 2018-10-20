
import { injectGlobal } from 'styled-components';
import { fontFamily } from './properties';

export function baseStyle() {
  // tslint:disable-next-line:no-unused-expression
  injectGlobal`
    html {
      width: 100%;
      height: 100%;
    }
    body {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      overscroll-behavior-y: none;
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
  `;
}