import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  // props necessárias para cadastrar o input no unform
  const { registerField, defaultValue = '', fieldName, error } = useField(name);

  // valor inicial do Input
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));
  // Assim que o elemento for exibido em tela, registra no unform
  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      // path: onde ele vai buscar o valor do input
      path: 'value',
      // setValue(ref: any, value) {
      //   inputValueRef.current.value = value;
      //   // A linha de código seguinte é responsável por mudar visualmente o texto que está dentro do input
      //   inputElementRef.current.setNativeProps({ text: value });
      // },
      // // o que vai acontecer com o input quando o unform limpar ele
      // clearValue() {
      //   inputValueRef.current.value = '';
      //   inputElementRef.current.clear(); // limpar o conteúdo
      // },
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} isFocused={isFocused}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666368"
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        // Pega o texto digitado pelo usuário e preenche a variavel value, toda vez que tiver um novo value digitado
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
