import { useSetState } from "ahooks";
import to from "await-to-js";
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
  useToast,
} from "native-base";
import { useDispatch } from "react-redux";
import { loginDriver } from "../../services/driver";
import { updateProfileInfo } from "../../slices/profileSlice";
import { NAVIGATOR_SCREEN } from "../../utils/enum";

const Login = ({ navigation }: any) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [state, setState] = useSetState({ phone: "", password: "" });

  const handleLogin = async () => {
    const [err, res]: any = await to(
      loginDriver({
        phone: state.phone?.trim?.(),
        password: state.password?.trim?.(),
      })
    );

    if (err) {
      return toast.show({
        description:
          err?.response?.data?.message?.toString?.() || "Đăng nhập thất bại!",
        placement: "top",
      });
    }

    toast.show({ description: "Đăng nhập thành công!", placement: "top" });
    dispatch(updateProfileInfo({ token: res.data?.token || "" } as any));
    navigation.navigate(NAVIGATOR_SCREEN.HOME_SCREEN);
  };

  return (
    <Center w="100%" h="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          GooTax Driver
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Đăng nhập tài khoản
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Số điện thoại</FormControl.Label>
            <Input
              placeholder="0851234567"
              onChangeText={(value) => setState({ phone: value })}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Mật khẩu</FormControl.Label>
            <Input
              type="password"
              placeholder="123456"
              onChangeText={(value) => setState({ password: value })}
            />
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Quên mật khẩu?
            </Link>
          </FormControl>
          <Button onPress={handleLogin} mt="2" colorScheme="indigo">
            Đăng nhập
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Bạn cần tài khoản mới.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate(NAVIGATOR_SCREEN.REGISTER)}
            >
              Đăng ký
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
