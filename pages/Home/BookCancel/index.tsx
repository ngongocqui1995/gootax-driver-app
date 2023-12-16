import { useSetState } from "ahooks";
import to from "await-to-js";
import { AlertDialog, Button, Text, useToast } from "native-base";
import React from "react";
import { cancelBookCar } from "../../../services/book";

interface BookCancelProps {
  book_info: any;
  onClose: () => void;
  onCancel: () => void;
}

const BookCancel: React.FC<BookCancelProps> = (props) => {
  const toast = useToast();
  const [state, setState] = useSetState<{ isOpen: boolean; loading: boolean }>({
    isOpen: false,
    loading: false,
  });
  const cancelRef = React.useRef(null);

  const handleCancel = async () => {
    setState({ loading: true });
    const [err] = await to(cancelBookCar(props.book_info?.id));
    if (err) {
      toast.show({
        description: "Huỷ đơn thất bại!",
        placement: "top",
      });
      setState({ isOpen: false, loading: false });
      return;
    }

    toast.show({
      description: "Huỷ đơn thành công!",
      placement: "top",
    });
    setState({ isOpen: false, loading: false });
    props.onCancel();
  };

  const onClose = () => {
    if (!state.loading) {
      setState({ isOpen: false });
    }
  };

  return (
    <>
      <Button
        style={{ width: 80, height: 50 }}
        borderColor="red.600"
        borderWidth="2"
        bgColor="white"
        isHovered
        onPress={() => setState({ isOpen: true })}
      >
        <Text fontSize={16} bold color="red.600">
          X
        </Text>
      </Button>
      <AlertDialog
        isOpen={state.isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Huỷ đơn</AlertDialog.Header>
          <AlertDialog.Body>
            Bạn có chắc chắn muốn huỷ đơn này không?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Huỷ
              </Button>
              <Button
                isLoading={state.loading}
                colorScheme="danger"
                onPress={handleCancel}
              >
                Đồng ý
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
};

export default BookCancel;
