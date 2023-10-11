import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Text,
  VStack,
} from "native-base";
import ProFormSelectCar from "../../components/ProForm/ProFormSelectCar";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const Register = ({ navigation }: any) => {
  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
          fontWeight="semibold"
        >
          GooTax Driver
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          Đăng ký tài khoản
        </Heading>
        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Tên</FormControl.Label>
            <Input placeholder="Nguyễn Văn A" />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input placeholder="0851234567" />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input type="password" placeholder="123456" />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
            <Input type="password" placeholder="123456" />
          </FormControl>
          <ProFormSelectCar />
          <Button mt="2" colorScheme="indigo">
            Đăng ký
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Bạn đã có tài khoản.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate(NAVIGATOR_SCREEN.LOGIN)}
            >
              Đăng nhập
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default Register;
