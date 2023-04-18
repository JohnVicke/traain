import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";

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
      console.error(JSON.stringify(err, null, 2));
    }
  });

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            onBlur={onBlur}
            className="mb-2 rounded bg-white/10 p-2 text-white"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onChangeText={(value) => onChange(value)}
            placeholder="johndoe@gmail.com"
            value={value}
          />
        )}
        name="emailAddress"
        rules={{ required: true }}
      />
      {errors.emailAddress && (
        <Text className="text-red-400">This is required.</Text>
      )}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            secureTextEntry
            autoComplete="password-new"
            textContentType="password"
            placeholder="*********"
            className="mb-2 rounded bg-white/10 p-2 text-white"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="password"
        rules={{ required: true }}
      />
      {errors.password && (
        <Text className="text-red-400">This is required.</Text>
      )}
      <TouchableOpacity
        className="rounded bg-pink-400 p-2"
        onPress={() => void onSubmit()}
      >
        <Text className="text-center font-semibold text-white">Sign in</Text>
      </TouchableOpacity>
      <Text className="text-center text-white">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up">
          <Text className="text-pink-400">Sign up here</Text>
        </Link>
      </Text>
    </>
  );
}

export default function SignIn() {
  return (
    <KeyboardAvoidingView className="h-full justify-center bg-[#1F104A] p-4">
      <SignInFlow />
    </KeyboardAvoidingView>
  );
}
