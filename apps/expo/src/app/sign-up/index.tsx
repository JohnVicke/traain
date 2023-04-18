import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";

type PrepareSignupForm = {
  emailAddress: string;
  password: string;
};

type VerifySignupForm = {
  code: string;
};

function VerifySignupFlow() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifySignupForm>();

  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (!isLoaded) return null;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  });

  return (
    <View className="flex h-full flex-col items-center justify-center">
      <Text className="mb-4 text-2xl font-bold text-white">
        Check your email
      </Text>
      <Text className="mb-4 text-lg text-white">
        We sent you a verification code to your email address.
      </Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            textContentType="oneTimeCode"
            onBlur={onBlur}
            className="mb-2 rounded bg-white/10 p-2 text-white"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            onChangeText={(value) => onChange(value)}
            placeholder="12345"
            value={value}
          />
        )}
        name="code"
        rules={{ required: true }}
      />
      {errors.code && <Text className="text-red-400">This is required.</Text>}
      <TouchableOpacity onPress={() => void onSubmit()}>
        <Text className="text-lg font-bold text-white">Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

function PrepareSignupFlow({
  setPending,
}: {
  setPending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { signUp, isLoaded } = useSignUp();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrepareSignupForm>();

  const onSubmit = handleSubmit(async (data) => {
    if (!isLoaded) return null;
    try {
      await signUp.create(data);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPending(true);
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
        <Text className="text-center font-semibold text-white">Sign up</Text>
      </TouchableOpacity>
    </>
  );
}

export default function SignUp() {
  const [isPendingVerification, setIsPendingVerification] =
    React.useState(false);

  return (
    <KeyboardAvoidingView className="h-full justify-center bg-[#1F104A] p-4">
      {!isPendingVerification ? (
        <PrepareSignupFlow setPending={setIsPendingVerification} />
      ) : (
        <VerifySignupFlow />
      )}
    </KeyboardAvoidingView>
  );
}
