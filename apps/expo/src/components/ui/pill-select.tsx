import { Text, TouchableOpacity, View } from "react-native";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

import { cn } from "~/utils/cn";

type PillValue = {
  value: string;
  display: string;
};

type PillSelectProps<
  TField extends FieldValues,
  TValues extends PillValue[],
> = {
  options: TValues;
  control: Control<TField>;
  name: Path<TField>;
  multiple?: boolean;
  className?: string;
  rules?: Omit<
    RegisterOptions<TField, Path<TField>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
};

export function PillSelect<
  TField extends FieldValues,
  TValues extends PillValue[],
>(props: PillSelectProps<TField, TValues>) {
  const { control, rules, options, multiple, name } = props;

  const handlePress = (
    currentValue: PillValue,
    fieldValue: TValues,
    onChange: (...event: any[]) => void,
  ) => {
    return multiple
      ? multiSelect(currentValue, fieldValue, onChange)
      : singleSelect(currentValue, onChange);
  };

  const singleSelect = (
    currentValue: PillValue,
    onChange: (...event: any[]) => void,
  ) => {
    onChange(currentValue);
  };

  const multiSelect = (
    currentValue: PillValue,
    fieldValue: TValues,
    onChange: (...event: any[]) => void,
  ) => {
    const isSelected = fieldValue?.find(
      (value) => value.value === currentValue.value,
    );
    if (isSelected?.value) {
      onChange(
        fieldValue.filter((value) => value.value !== currentValue.value),
      );
      return;
    }
    onChange([...fieldValue, currentValue]);
  };

  const compare = (value: PillValue | PillValue[], option: PillValue) => {
    if (!value) return false;
    if (multiple) {
      return Boolean(
        (value as PillValue[]).find((v) => v.value === option.value),
      );
    }
    return (value as PillValue).value === option.value;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <View>
          <View className="flex-row flex-wrap gap-x-4 gap-y-2">
            {options.map((option) => (
              <TouchableOpacity
                className="mb-2 rounded-lg bg-slate-800 p-2"
                onPress={() => handlePress(option, field.value, field.onChange)}
                key={option.value}
              >
                <Text
                  className={cn(
                    compare(field.value, option)
                      ? "font-bold text-pink-300"
                      : "font-normal text-slate-50",
                  )}
                >
                  {option.display}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!error && (
            <Text className="text-xs text-red-400">This is required!</Text>
          )}
        </View>
      )}
    />
  );
}
