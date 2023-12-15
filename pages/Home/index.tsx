import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import to from "await-to-js";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import _ from "lodash";
import { Flex, Image, Spinner, View } from "native-base";
import React, { useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { changeLocation } from "../../services/driver";
import { updateProfileInfo } from "../../slices/profileSlice";
import {
  ENUM_STATUS_BOOK,
  NAVIGATOR_SCREEN,
  SERVER_URL,
} from "../../utils/enum";
import { getCurrentPosition } from "../../utils/utils";
import BookInfo from "./BookInfo";

const Home = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const profile = useSelector((state: any) => state.profile);
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState<{
    location: { lat?: number; lng?: number };
    loading: boolean;
    data: any[];
    isOpen: boolean;
    book_info?: any;
  }>({
    location: { lat: undefined, lng: undefined },
    loading: false,
    data: [],
    isOpen: false,
    book_info: undefined,
  });

  useEffect(() => {
    if (profile?.id) {
      const socket = io(SERVER_URL);
      socket.on("connect", () => {
        socket.emit("message", {
          cmd_type: "JOIN",
          room_id: profile?.id,
        });
      });

      socket.on("message", ({ message }) => {
        setState({
          data: _.unionBy([message], state.data, "id").filter(
            (it) => it.status === ENUM_STATUS_BOOK.FINDING
          ),
        });
      });
    }
  }, [profile?.id]);

  useAsyncEffect(async () => {
    setState({ loading: true });
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setState({ loading: false });
      return;
    }

    let location;
    do {
      [, location] = await to(getCurrentPosition());
    } while (!location?.coords);

    Location.watchPositionAsync(
      { accuracy: LocationAccuracy.Highest },
      async (position) => {
        const { latitude, longitude } = position.coords;
        await changeLocation({
          current_lat: latitude,
          current_lng: longitude,
        });

        const location = { lat: latitude, lng: longitude };
        setState({ location });
        dispatch(updateProfileInfo({ location } as any));
      }
    );

    if (location.coords) {
      const { longitude, latitude } = location.coords;

      map.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        4000
      );
      setState({ location: { lat: latitude, lng: longitude } });
    }
    setState({ loading: false });
  }, [isFocused]);

  return (
    <View>
      <MapView
        loadingBackgroundColor="red"
        ref={(ref) => {
          map.current = ref;
        }}
        style={{ width: "100%", height: "100%" }}
        userInterfaceStyle="light"
      >
        {state.location.lat && state.location.lng && (
          <Marker
            coordinate={{
              latitude: state.location.lat,
              longitude: state.location.lng,
            }}
          >
            <Image
              alt="location-user"
              source={require("../../assets/location-taxi.png")}
              style={{ height: 35, width: 35 }}
            />
          </Marker>
        )}
        {state.data.map((it) => (
          <Marker
            key={it.id}
            onPress={() => setState({ isOpen: true, book_info: it })}
            coordinate={{
              latitude: it.from_address_lat,
              longitude: it.from_address_lng,
            }}
          >
            <Image
              alt="location-user"
              source={require("../../assets/location-user.png")}
              style={{ height: 35, width: 35 }}
            />
          </Marker>
        ))}
      </MapView>
      <BookInfo
        isOpen={state.isOpen}
        book_info={state.book_info}
        onOk={() => {
          setState({
            data: state.data.filter((it) => it.id !== state.book_info?.id),
            isOpen: false,
          });
          navigation.navigate(NAVIGATOR_SCREEN.BOOK_DETAIL, {
            id: state.book_info?.id,
          });
        }}
        onClose={() => setState({ isOpen: false })}
      />
      {state.loading && (
        <Flex
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0, 0, 0, 0.2)"
          flex="1"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner color="black" size="lg" />
        </Flex>
      )}
    </View>
  );
};

export default Home;
