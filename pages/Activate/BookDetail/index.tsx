import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import {
  Box,
  Button,
  Center,
  ChevronLeftIcon,
  Flex,
  FormControl,
  Image,
  Input,
  View,
  useToast,
} from "native-base";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSelector } from "react-redux";
import { getOneBookCar, updateStatusBookCar } from "../../../services/book";
import {
  ENUM_STATUS_BOOK,
  ENUM_STATUS_DRIVER,
  GOOGLE_MAPS_API_KEY,
  STATUS_BOOK,
  STATUS_DRIVER,
} from "../../../utils/enum";

const BookDetail = ({ route, navigation }: any) => {
  const { id } = route.params || {};
  const isFocused = useIsFocused();
  const profile = useSelector((state: any) => state.profile);
  const toast = useToast();
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState<{ data: any[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const loadBookCar = async (id: string) => {
    const [, res] = await to(getOneBookCar(id));
    setState({ data: res?.data || [] });
  };

  useEffect(() => {
    map.current?.animateToRegion(
      {
        latitude: state.data[0].from_address_lat,
        longitude: state.data[0].from_address_lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      4000
    );
  }, [state.data]);

  useAsyncEffect(async () => {
    if (isFocused) {
      await loadBookCar(id);
    }
  }, [isFocused]);

  const onSubmit = async (status: string) => {
    setState({ loading: true });
    const change_status =
      status === ENUM_STATUS_BOOK.PICKING
        ? ENUM_STATUS_BOOK.RIDING
        : ENUM_STATUS_BOOK.COMPLETED;
    const [err]: any = await to(updateStatusBookCar(id, change_status));

    if (err) {
      return toast.show({
        description: "Cập nhật trạng thái thất bại!",
        placement: "top",
      });
    }

    toast.show({
      description: "Cập nhật trạng thái thành công!",
      placement: "top",
    });
    await loadBookCar(id);
    setState({ loading: false });

    map.current?.fitToSuppliedMarkers(["mk1", "mk2"], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    });

    if (change_status === ENUM_STATUS_BOOK.COMPLETED) navigation.goBack();
  };

  return (
    <Flex direction="column">
      {state.data.map((it: any) => (
        <View key={it.id}>
          <View height="60%">
            <MapView
              ref={(ref) => {
                map.current = ref;
              }}
              style={{ width: "100%", height: "100%" }}
              userInterfaceStyle="light"
              onMapReady={() => {
                map.current?.fitToSuppliedMarkers(["mk1", "mk2"], {
                  edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                });
              }}
            >
              {it.from_address_lat &&
              it.from_address_lng &&
              it.status === ENUM_STATUS_DRIVER.PICKING ? (
                <Marker
                  coordinate={{
                    latitude: it.from_address_lat,
                    longitude: it.from_address_lng,
                  }}
                  identifier={"mk1"}
                >
                  <Image
                    alt="location-user"
                    source={require("../../../assets/location-user.png")}
                    style={{ height: 35, width: 35 }}
                  />
                </Marker>
              ) : null}
              {it.to_address_lat &&
              it.to_address_lng &&
              it.status === ENUM_STATUS_DRIVER.RIDING ? (
                <Marker
                  coordinate={{
                    latitude: it.to_address_lat,
                    longitude: it.to_address_lng,
                  }}
                  identifier={"mk1"}
                >
                  <Image
                    alt="location-user"
                    source={require("../../../assets/location-user.png")}
                    style={{ height: 35, width: 35 }}
                  />
                </Marker>
              ) : null}
              {profile?.location?.lat && profile?.location?.lng ? (
                <Marker
                  coordinate={{
                    latitude: profile?.location.lat,
                    longitude: profile?.location.lng,
                  }}
                  identifier={"mk2"}
                >
                  <Image
                    alt="location-taxi"
                    source={require("../../../assets/location-taxi.png")}
                    style={{ height: 35, width: 35 }}
                  />
                </Marker>
              ) : null}
              {it.from_address_lat &&
              it.from_address_lng &&
              profile?.location.lat &&
              profile?.location.lng &&
              it.status === ENUM_STATUS_DRIVER.PICKING ? (
                <MapViewDirections
                  language="vi"
                  strokeWidth={5}
                  strokeColor="green"
                  origin={{
                    latitude: it.from_address_lat,
                    longitude: it.from_address_lng,
                  }}
                  destination={{
                    latitude: profile?.location.lat,
                    longitude: profile?.location.lng,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                />
              ) : null}
              {it.to_address_lat &&
              it.to_address_lng &&
              profile?.location.lat &&
              profile?.location.lng &&
              it.status === ENUM_STATUS_DRIVER.RIDING ? (
                <MapViewDirections
                  language="vi"
                  strokeWidth={5}
                  strokeColor="green"
                  origin={{
                    latitude: it.to_address_lat,
                    longitude: it.to_address_lng,
                  }}
                  destination={{
                    latitude: profile?.location.lat,
                    longitude: profile?.location.lng,
                  }}
                  apikey={GOOGLE_MAPS_API_KEY}
                />
              ) : null}
            </MapView>
          </View>
          <View height="40%">
            <Center>
              <Box w="90%" p="4">
                <View>
                  <FormControl isRequired isReadOnly>
                    <FormControl.Label>Khoảng cách</FormControl.Label>
                    <Input
                      value={`${it.distance || 0}`}
                      isDisabled
                      placeholder="Khoảng cách"
                    />
                  </FormControl>
                  <FormControl isRequired isReadOnly>
                    <FormControl.Label>Thành tiền</FormControl.Label>
                    <Input
                      value={`${it.amount || 0}`}
                      isDisabled
                      placeholder="Thành tiền"
                    />
                  </FormControl>
                  <FormControl isRequired isReadOnly>
                    <FormControl.Label>Trạng thái</FormControl.Label>
                    <Input
                      value={STATUS_BOOK[it.status as ENUM_STATUS_BOOK]?.text}
                      isDisabled
                      placeholder="Trạng thái"
                    />
                  </FormControl>
                  {[
                    ENUM_STATUS_DRIVER.PICKING,
                    ENUM_STATUS_DRIVER.RIDING,
                  ].includes(it.status) ? (
                    <Button
                      my="4"
                      colorScheme={
                        STATUS_DRIVER[it.status as ENUM_STATUS_DRIVER]?.color
                      }
                      isLoading={state.loading}
                      onPress={() => onSubmit(it.status)}
                    >
                      {STATUS_DRIVER[it.status as ENUM_STATUS_DRIVER]?.text}
                    </Button>
                  ) : null}
                </View>
              </Box>
            </Center>
          </View>
          <View position="absolute" top={55} left={5}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeftIcon size="24px" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Flex>
  );
};

export default BookDetail;
