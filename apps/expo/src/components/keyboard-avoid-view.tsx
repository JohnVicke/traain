import {
  KeyboardAvoidingView,
  Platform,
  type KeyboardAvoidingViewProps,
} from "react-native";

export function KeyboardAvoidView(props: KeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      {...props}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    />
  );
}
