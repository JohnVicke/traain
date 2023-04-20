import React from "react";
import { Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { TextInputField } from "~/components/ui/text-inputfield";

type SignInForm = {
  emailAddress: string;
  password: string;
};

function SignInFlow() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInForm>();

  const onSubmit = handleSubmit(async (data) => {
    if (!isLoaded) return null;
    try {
      const completeSignIn = await signIn.create({
        identifier: data.emailAddress,
        password: data.password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/");
    } catch (err) {
      setError("root", {
        message: "Invalid email or password",
      });
    }
  });

  return (
    <View className="gap-y-4">
      {errors.root && (
        <Text className="mb-2 text-red-400">{errors.root.message}</Text>
      )}
      <TextInputField
        control={control}
        name="emailAddress"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="johndoe@gmail.com"
        rules={{ required: true }}
      />
      <TextInputField
        control={control}
        name="password"
        secureTextEntry
        autoComplete="password-new"
        placeholder="*********"
        rules={{ required: true }}
      />
      <Button onPress={() => void onSubmit()}>Sign in</Button>
      <Text className="text-center text-white">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up">
          <Text className="text-pink-400">Sign up here</Text>
        </Link>
      </Text>
    </View>
  );
}

export default function SignIn() {
  return <SignInFlow />;
}
