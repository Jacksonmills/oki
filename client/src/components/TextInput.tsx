import React, { useState } from 'react';
import styled from 'styled-components';

type TextInputProps = {
  buttonText: string,
  value: string;
  onChange: (value: string) => void;
  onClick?: (event: React.SyntheticEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  forwardRef?: React.Ref<HTMLInputElement>;
};

const TextInput: React.FC<TextInputProps> = ({ buttonText, value, onChange, onClick, placeholder, disabled, forwardRef }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // draw with me style mini inline chat game
  // const [drawWithMe, setDrawWithMe] = useState<string[]>([]);


  return (
    <Wrapper>
      <Input
        type="text"
        spellCheck="true"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        ref={forwardRef ? forwardRef : null}
      />
      <Button type="button" onClick={onClick} disabled={disabled}>{buttonText}</Button>
    </Wrapper>
  );
};

const Input = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  padding: 0 0.5em;
  font-size: ${16 / 16}rem;

  &:hover, &:focus, &:focus-visible {
    border: none;
    outline: none;
  }

  @media (min-width: 768px) {
    padding: 0 1em;
  }
`;

const Button = styled.button`
  border-radius: 6px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background-color: #17171c;
  color: white;
  transition: all 250ms ease;

  &[disabled] {
    background-color: #383846;
    color: grey;
    cursor: not-allowed;

    &:hover, &:focus, &:focus-visible {
      border-color: transparent;
      outline: none;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-basis: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.25em;
  font-size: 1em;
  transition: border-color 0.25s;
  background-color: #2b2a33;

  &:hover {
    border-color: #646cff;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  &:hover, &:focus, &:focus-visible {
    ${Input} {
      border: none;
      outline: none;
    }
  }

  @media (min-width: 768px) {
    padding: 0.5em;
  }
`;

export default TextInput;