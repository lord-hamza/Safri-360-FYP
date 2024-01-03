import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, PermissionsAndroid } from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import haversine from "haversine";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 38;
const LONGITUDE = -100;

const AnimatedMarkers = () => {
    const [region, setRegion] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [distanceTravelled, setDistanceTravelled] = useState(0);
    const [prevLatLng, setPrevLatLng] = useState({});
    const [coordinate] = useState(
        new AnimatedRegion({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: 0,
            longitudeDelta: 0,
        }),
    );

    const markerRef = useRef(null);

    const getMapRegion = () => ({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    useEffect(() => {
        const requestCameraPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: "Location Access Permission",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                });
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use the camera");
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        };

        const calcDistance = (newLatLng) => {
            return haversine(prevLatLng, newLatLng) || 0;
        };

        const watchID = Geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newCoordinate = {
                    latitude,
                    longitude,
                };
                console.log(newCoordinate);

                if (markerRef.current) {
                    markerRef.current?.animateMarkerToCoordinate(newCoordinate, 500);
                }

                setRegion({
                    ...region,
                    latitude: newCoordinate.latitude,
                    longitude: newCoordinate.longitude,
                });
                setRouteCoordinates([...routeCoordinates, newCoordinate]);
                setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate));
                setPrevLatLng(newCoordinate);
            },
            (error) => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10,
            },
        );

        return () => {
            Geolocation.clearWatch(watchID);
        };
    }, [region.latitude, region.longitude]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showUserLocation={true}
                followUserLocation={true}
                loadingEnabled={true}
                region={region}
            >
                <Polyline coordinates={routeCoordinates} strokeWidth={5} />
                <Marker.Animated ref={markerRef} coordinate={getMapRegion()} />
            </MapView>
            <View style={styles.buttonContainer}>
                <Text style={styles.bottomBarContent}>{parseFloat(distanceTravelled).toFixed(2)} km</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: "stretch",
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        marginVertical: 20,
        backgroundColor: "transparent",
    },
});

export default AnimatedMarkers;
