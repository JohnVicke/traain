import { Picker, type PickerItemProps } from "@react-native-picker/picker";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

const selectedColor = "#e2e8f0";
const selectionColor = "#334155";

type PickerfieldProps<
  TField extends FieldValues,
  TValues extends PickerItemProps,
> = {
  control: Control<TField>;
  name: Path<TField>;
  options: TValues[];
};
export function Pickerfield<
  TField extends FieldValues,
  TValues extends PickerItemProps,
>(props: PickerfieldProps<TField, TValues>) {
  const { options, control, name } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <Picker selectedValue={value} onValueChange={onChange} mode="dialog">
          {options.map((option) => (
            <Picker.Item
              key={`picker-item-${option.value}`}
              color={value === option.value ? selectedColor : selectionColor}
              {...option}
            />
          ))}
        </Picker>
      )}
    />
  );
}
