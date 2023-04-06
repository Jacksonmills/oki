import styled from 'styled-components';
import Button from './Button';

export default styled(Button)`
  display: block;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:focus {
    outline-offset: 2px;
  }
`;