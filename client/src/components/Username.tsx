import styled from "styled-components";

export default styled.span<{ hexcode?: string; }>`
  color: ${(props) => props.hexcode ? props.hexcode : "#ffffff"};
  font-weight: bold;
  margin-right: 0.25rem;
`;