import { Modal, TouchableWithoutFeedback, View } from "react-native";
import { Trash } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

type EditSetHalfModalProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

export default function EditSetHalfModal({
  open,
  onClose,
  id,
}: EditSetHalfModalProps) {
  const utils = api.useContext();
  const mutation = api.workoutSet.remove.useMutation({
    onSuccess: async () => {
      await utils.workout.get.invalidate();
      onClose();
    },
  });

  const handleDeletion = () => {
    mutation.mutate({ id });
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <Modal
          transparent
          animationType="none"
          visible={open}
          onRequestClose={onClose}
        >
          <View className="flex-1 justify-end">
            <TouchableWithoutFeedback onPress={onClose}>
              <MotiView
                key="bg-view"
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 h-full w-full bg-black/50"
              />
            </TouchableWithoutFeedback>
            <MotiView
              key="content-view"
              from={{ translateY: 500 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 1000 }}
              transition={{
                type: "timing",
              }}
              className="h-1/2 rounded-t-xl bg-slate-800 p-4"
            >
              <Button
                className="bg-red-400"
                onPress={handleDeletion}
                startIcon={Trash}
              >
                Remove
              </Button>
            </MotiView>
          </View>
        </Modal>
      )}
    </AnimatePresence>
  );
}
