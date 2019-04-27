import styled from 'styled-components';
import * as properties from '../../properties';

const Anker = styled.a`
  color: ${properties.colors.link};
  font-weight: ${properties.fontWeights.bold};
  text-decoration: underline;
  &:link {
    color: ${properties.colors.link};
    font-weight: ${properties.fontWeights.bold};
  }
  &:visited {
    color: ${properties.colors.link};
    font-weight: ${properties.fontWeights.bold};
  }
`;

export default Anker;
