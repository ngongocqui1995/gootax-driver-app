import { useSetState } from "ahooks";
import to from "await-to-js";
import { AlertDialog, Button, Text, useToast } from "native-base";
import React from "react";
import { receiveOrder } from "../../../services/driver";

interface BookCancelProps {
  book_info: any;
  onClose: () => void;
  onOk: () => void;
}

const BookSuccess: React.FC<BookCancelProps> = (props) => {
  const toast = useToast();
  const [state, setState] = useSetState<{ isOpen: boolean; loading: boolean }>({
    isOpen: false,
    loading: false,
  });
  const cancelRef = React.useRef(null);

  const handleSuccess = async () => {
    setState({ loading: true });
    const [err] = await to(receiveOrder(props.book_info?.id));
    if (err) {
      toast.show({
        description: "Nhận đơn thất bại!",
        placement: "top",
      });
      setState({ isOpen: false, loading: false });
      return;
    }

    toast.show({
      description: "Nhận đơn thành công!",
      placement: "top",
    });
    setState({ isOpen: false, loading: false });
    props.onOk();
  };

  const onClose = () => {
    if (!state.loading) {
      setState({ isOpen: false });
    }
  };

  return (
    <>
      <Button
        flex="1"
        bgColor="green.600"
        onPress={() => setState({ isOpen: true })}
      >
        <Text fontSize={16} color="white">
          Chấp nhận
        </Text>
      </Button>
      <AlertDialog
        isOpen={state.isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Nhận đơn</AlertDialog.Header>
          <AlertDialog.Body>
            Bạn có chắc chắn muốn nhận đơn này không?
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
                colorScheme="success"
                onPress={handleSuccess}
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

export default BookSuccess;
