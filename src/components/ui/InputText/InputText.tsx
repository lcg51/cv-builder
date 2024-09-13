import { ChangeEvent, FocusEvent, useCallback, useMemo, useState } from "react";
import "./InputText.css";

export type InputTextProps = {
  icon?: React.ReactNode;
  label: string;
  onChange: (e: string) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  type: string;
  testID: string;
};

type InputClassNames = string | number | symbol;

export const InputText = ({
  defaultValue = "",
  icon,
  onChange,
  onFocus,
  onBlur,
  label,
  testID,
  type,
}: InputTextProps) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [isFocused, setFocus] = useState<boolean>(false);
  const [charLength, setCharLength] = useState(0);
  const handleOnFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocus(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleOnBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocus(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = (nextValue: string) => {
    setCharLength(nextValue.length);
    setValue(nextValue);
    onChange(value);
  };

  const inputWrapperClass = useMemo(() => {
    const arrayClass: { [key in InputClassNames]: boolean } = {
      'inputText__wrapper': true,
      'inputText__wrapper--focused': isFocused,
    };
    return Object.keys(arrayClass)
      .map((key) => (arrayClass[key] ? key : ""))
      .join(" ");
  }, [isFocused]);

  const inputLabelClass = useMemo(() => {
    const arrayClass: { [key in InputClassNames]: boolean } = {
      'inputText__label': true,
      'inputText__label--focused': isFocused || charLength > 0,
    };
    return Object.keys(arrayClass)
      .map((key) => (arrayClass[key] ? key : ""))
      .join(" ");
  }, [isFocused, charLength]);

  return (
    <div className={inputWrapperClass}>
      {icon && icon}
      <div className='inputText__container'>
        {label && (
          <label className={inputLabelClass} htmlFor='name'>
            {label}
          </label>
        )}
        <input
          data-testid={testID}
          id={testID}
          type={type}
          className='inputText__input'
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target.value)
          }
          onFocus={(e: FocusEvent<HTMLInputElement>) => handleOnFocus(e)}
          onBlur={(e: FocusEvent<HTMLInputElement>) => handleOnBlur(e)}
        />
      </div>
    </div>
  );
};
