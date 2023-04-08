import styled from "styled-components";
import { COLORS } from "../constants";

export default styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: ${COLORS.backgroundDark};
  color: ${COLORS.text};
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: ${COLORS.primary};
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;