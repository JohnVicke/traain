import { Modal, View } from "react-native";
import { Trash } from "lucide-react-native";

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
  const mutation = api.workoutSet.remove.useMutation();

  const handleDeletion = () => {
    mutation.mutate({ id });
  };

  return (
    <Modal
      transparent
      className="justify-end"
      animationType="slide"
      visible={open}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View>
          <Button onPress={handleDeletion} startIcon={Trash}>
            Remove
          </Button>
          <Button asLink href="/">
            Home
          </Button>
        </View>
      </View>
    </Modal>
  );
}
