import {
  Pressable,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { Link } from "expo-router";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";

import { cn } from "~/utils/cn";

type ButtonVariants = {
  variant: {
    primary: string;
    secondary: string;
    outline: string;
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
      outline: "border-slate-50 border",
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

const textVariants = cva<ButtonVariants>("font-bold inline-flex", {
  variants: {
    variant: {
      primary: "text-slate-950",
      secondary: "text-black",
      outline: "text-slate-50",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

type DefaultButtonProps = {
  asLink?: false;
  href?: never;
};

type LinkButtonProps = {
  asLink: true;
  href: string;
};

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> &
  (DefaultButtonProps | LinkButtonProps) & {
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
  };

export function Button(props: ButtonProps) {
  const {
    children,
    variant,
    size,
    asLink,
    href,
    className,
    endIcon: EndIcon,
    startIcon: StartIcon,
    ...touchableOpacityProps
  } = props;

  if (asLink) {
    return (
      <Link href={href} asChild>
        <Pressable className={cn(className, buttonVariants({ variant, size }))}>
          {() => (
            <>
              {StartIcon && (
                <StartIcon className={cn(textVariants({ variant, size }))} />
              )}
              <Text className={cn(textVariants({ variant, size }))}>
                {children}
              </Text>
              {EndIcon && (
                <EndIcon className={cn(textVariants({ variant, size }))} />
              )}
            </>
          )}
        </Pressable>
      </Link>
    );
  }
  return (
    <TouchableOpacity
      className={cn(className, buttonVariants({ variant, size }))}
      {...touchableOpacityProps}
    >
      <Text className={cn(textVariants({ variant, size }))}>{children}</Text>
    </TouchableOpacity>
  );
}
