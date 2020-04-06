import styled from 'styled-components';
import * as properties from '../../properties';

const baseStyle = `
border-radius: 4px;
border-width: 0;
display: flex;
font-weight: 700;
font-size: 1rem;
line-height: 1;
padding: 0.8rem;
text-decoration: none;
align-items: center;
cursor: pointer;
border-radius: 4px;
text-align: center;
transition: ${properties.fadeAnimation};
&:hover {
  opacity: ${properties.hoverFeedbackOpacity};
}
`;

const ButtonBase = styled.button`
  ${baseStyle}
`;

const AnkerButtonBase = styled.a`
  ${baseStyle}
`;

const buttonStyle = `
background-color: inherit;
border: ${properties.border};
color: ${properties.colors.gray};
`;

export const AnkerButton = styled(AnkerButtonBase)`
  ${buttonStyle}
`;

export const Button = styled(ButtonBase)`
  ${buttonStyle}
`;

const primaryButtonStyle = `
background-color: ${properties.colors.primary};
color: ${properties.colors.white};
&:link {
  color: white;
}
&:visited {
  color: white;
}
`;

export const PrimaryAnkerButton = styled(AnkerButtonBase)`
  ${primaryButtonStyle}
`;

export const PrimaryButton = styled(ButtonBase)`
  ${primaryButtonStyle}
`;

export const WarningButton = styled(ButtonBase)`
  background-color: ${properties.colors.warning};
  color: ${properties.colors.white};
`;

export default Button;
