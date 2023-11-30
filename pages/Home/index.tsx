import { useIsFocused } from "@react-navigation/native";
import { useAsyncEffect, useSetState } from "ahooks";
import * as Location from "expo-location";
import { Flex, Image, Spinner, View, useToast } from "native-base";
import React from "react";
import MapView, { Marker } from "react-native-maps";

const Home = () => {
  const isFocused = useIsFocused();
  const toast = useToast();
  const map = React.useRef<MapView | null>();
  const [state, setState] = useSetState<{
    location: { lat?: number; lng?: number };
    loading: boolean;
  }>({
    location: { lat: undefined, lng: undefined },
    loading: false,
  });

  useAsyncEffect(async () => {
    if (isFocused) {
      setState({ loading: true });
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.show({
          description: "Bạn không cho phép truy cập vị trí!",
          placement: "top",
        });
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      if (coords) {
        const { longitude, latitude } = coords;

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
    } else {
      setState({ location: { lat: undefined, lng: undefined } });
    }
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
              source={require("../../assets/location-user.png")}
              style={{ height: 35, width: 35 }}
            />
          </Marker>
        )}
      </MapView>
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
