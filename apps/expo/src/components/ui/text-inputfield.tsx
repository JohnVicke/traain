import {
  TextInput as RNTextInput,
  Text,
  View,
  type TextInputProps,
} from "react-native";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

type TextInputFieldProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
};

export function TextInputField<T extends FieldValues>(
  props: TextInputFieldProps<T>,
) {
  const { control, name, rules, ...textFieldProps } = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <RNTextInput
            className="rounded bg-white/10 p-2 text-white"
            {...textFieldProps}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
          {!!error && (
            <Text className="text-xs text-red-400">This is required!</Text>
          )}
        </View>
      )}
    />
  );
}
