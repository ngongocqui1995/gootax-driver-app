import {
  Actionsheet,
  Badge,
  Box,
  Center,
  FlatList,
  Flex,
  Text,
  View,
} from "native-base";
import BookCancel from "../BookCancel";
import BookSuccess from "../BookSuccess";

interface BookInfoProps {
  isOpen: boolean;
  book_info: any;
  onOk: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const BookInfo: React.FC<BookInfoProps> = (props) => {
  return (
    <Actionsheet isOpen={props.isOpen} onClose={props.onClose}>
      <Actionsheet.Content h={380}>
        <View flex="1" w="full" px="2">
          <Box rounded="lg" borderColor="coolGray.200" borderWidth="1" p="1">
            <FlatList
              data={[
                {
                  title: "Địa chỉ đón",
                  description: props.book_info?.from_address,
                  color: "primary.300",
                },
                {
                  title: "Địa chỉ đến",
                  description: props.book_info?.to_address,
                  color: "orange.300",
                },
              ]}
              renderItem={({ item }) => {
                return (
                  <Flex h="20" w="full" direction="row">
                    <Flex
                      px="2"
                      pt="1.5"
                      pb="4"
                      direction="column"
                      alignItems="center"
                      style={{ gap: 4 }}
                    >
                      <Center h="3" w="3" rounded="full" bg={item.color} />
                      <Center h="full" w="0.5" bg={item.color} />
                    </Flex>
                    <View flex="1">
                      <Text fontSize={16} bold>
                        {item.title}
                      </Text>
                      <Text color="gray.600">{item.description}</Text>
                    </View>
                  </Flex>
                );
              }}
            />
            <Badge m="2" colorScheme="warning">
              {`Khoảng cách ${(props.book_info?.distance / 1000).toFixed(2)}km`}
            </Badge>
          </Box>
          <Box
            mt="2"
            rounded="lg"
            borderColor="coolGray.200"
            borderWidth="1"
            p="4"
          >
            <Flex justifyContent="space-between" direction="row">
              <Text fontSize={16}>Tổng tiền</Text>
              <Text fontSize={16} bold>
                {props.book_info?.amount?.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </Flex>
          </Box>
          <Flex mt="2" direction="row" style={{ gap: 4 }}>
            <BookCancel
              book_info={props.book_info}
              onClose={props.onClose}
              onCancel={props.onCancel}
            />
            <BookSuccess
              book_info={props.book_info}
              onClose={props.onClose}
              onOk={props.onOk}
            />
          </Flex>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default BookInfo;
