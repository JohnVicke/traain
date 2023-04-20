import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/cn";

type ButtonVariants = {
  variant: {
    primary: string;
    secondary: string;
  };
  size: {
    sm: string;
    md: string;
    lg: string;
  };
};

const buttonVariants = cva<ButtonVariants>("rounded items-center", {
  variants: {
    variant: {
      primary: "bg-slate-50",
      secondary: "bg-gray-300",
    },
    size: {
      sm: "px-2 py-1",
      md: "px-4 py-2",
      lg: "px-6 py-3",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const textVariants = cva<ButtonVariants>("font-bold", {
  variants: {
    variant: {
      primary: "text-slate-950",
      secondary: "text-black",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = TouchableOpacityProps & VariantProps<typeof buttonVariants>;

export function Button(props: ButtonProps) {
  const { children, variant, size, ...touchableOpacityProps } = props;
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size }))}
      {...touchableOpacityProps}
    >
      <Text className={cn(textVariants({ variant, size }))}>{children}</Text>
    </TouchableOpacity>
  );
}
