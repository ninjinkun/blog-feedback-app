
import { createGlobalStyle } from 'styled-components';
import { fontFamily, colors } from './properties';

export const GlobalStyle = createGlobalStyle`
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
  a:link {
    color: ${colors.link};
  }
  a:visited {
    color: ${colors.link};
  }
`;
