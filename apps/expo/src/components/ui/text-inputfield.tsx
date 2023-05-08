import {
  TextInput as RNTextInput,
  Text,
  View,
  type TextInputProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

type TextInputFieldVariants = {
  variant: {
    filled: string;
    ghost: string;
  };
};

const textInputFieldVariants = cva<TextInputFieldVariants>(
  "rounded p-2 text-white",
  {
    variants: {
      variant: {
        filled: "bg-white/10",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "filled",
    },
  },
);

type TextInputFieldProps<T extends FieldValues> = TextInputProps &
  VariantProps<typeof textInputFieldVariants> & {
    className?: string;
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
  const {
    control,
    variant,
    onBlur: passedOnBlur,
    name,
    rules,
    className,
    ...textFieldProps
  } = props;
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
            className={textInputFieldVariants({ variant, className })}
            {...textFieldProps}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onChangeText={onChange}
            onBlur={passedOnBlur || onBlur}
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
