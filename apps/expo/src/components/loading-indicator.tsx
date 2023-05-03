import { MotiView } from "moti";

export function LoadingIndicator(props: { size: number }) {
  const { size } = props;
  return (
    <MotiView
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
      }}
      style={{
        backgroundColor: "#fff",
        borderColor: "#99f6e4",
        shadowColor: "#fff",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 1,
        borderWidth: size / 2,
      }}
      from={{
        width: size,
        height: size,
        borderRadius: size / 2,
        shadowOpacity: 0.5,
        borderWidth: 0,
      }}
      animate={{
        width: size + 20,
        height: size + 20,
        borderRadius: (size + 20) / 2,
        borderWidth: size / 10,
        shadowOpacity: 1,
      }}
    />
  );
}
