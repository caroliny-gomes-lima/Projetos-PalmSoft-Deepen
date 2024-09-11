import React from "react";
import { FormControl, Input, TextField } from "@material-ui/core";
import styled from "styled-components";
import { withTheme } from "@material-ui/styles";
import { formConnector } from "../../FormConfig";
import { Autocomplete } from "@material-ui/lab";
import { InputAdornment } from "@material-ui/core";

const StyledInput = styled(Input)(
  ({
    theme,
    error,
    disabled,
    $inputStyle,
    $error,
    $small,
    $smallBottom,
    $alternativeColors,
    $margin,
    $height,
  }) => {
    const { spacing, palette: colors } = theme;
    return {
      padding: $small ? spacing(0, 1) : spacing(1),
      paddingTop: $smallBottom === 2 ? spacing(1) : null,
      multiline: true,
      textOverflow: "ellipsis",
      backgroundColor: $alternativeColors === 2 ? "white" : colors.darkBlue,
      borderRadius: 5,
      marginTop: $margin === 2 ? spacing(3.2) : spacing(0.5),
      height: $height === 2 ? spacing(6) : null,
      boxShadow: $error
        ? `inset 0 0 0 2px ${colors.error.main}`
        : `inset 0 0 0 ${colors.error.main}`,
      opacity: disabled ? 0.3 : 1,
      "& .MuiInput-input": {
        color: "red",

        "&::placeholder": {
          opacity: 0.8,
        },
      },
      ...$inputStyle,
    };
  }
);

function InputComponent(props) {
  const { value, error, onBlur, setConfigs, formHandler, usedProps } =
    formConnector.useStringValue(props);
  const {
    inputLabel,
    hideVisualError,
    small,
    smallBottom,
    alternativeColors,
    marginInput,
    heightInput,
    options,
    iconEnd,
    inputDataKey,
  } = usedProps;

  return (
    <FormControl fullWidth error={hideVisualError ? null : Boolean(error)}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        defaultValue={
          //Se for entrada digitada então entrada digitada, se não entrada select
          inputDataKey ? inputDataKey : { label: "Todos", value: -1 }
        }
        onChange={(event, value) => {
          if (value === null) {
            setConfigs(-1, event);
          } else {
            setConfigs(value.value, event);
          }
          setTimeout(() => {
            onBlur();
            formHandler.testInputError(props.name);
          }, 10);
        }}
        renderInput={(params) => (
          <StyledInput
            inputProps={{
              ...params.inputProps,
              disableUnderline: true,
              autoComplete: "new-password",
            }}
            endAdornment={
              <InputAdornment position="end">{iconEnd}</InputAdornment>
            }
            $alternativeColors={alternativeColors}
            $margin={marginInput}
            $height={heightInput}
            $small={small}
            $smallBottom={smallBottom}
            label={value ? inputLabel : null}
            {...params}
          />
        )}
      />
    </FormControl>
  );
}

export default withTheme(InputComponent);
