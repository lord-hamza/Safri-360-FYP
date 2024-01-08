import { GOOGLE_MAPS_API_KEY } from "@env";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useDispatch, useSelector } from "react-redux";
import { ref, get } from "firebase/database";

import { dbRealtime } from "../firebase/config";
import { useMapContext } from "@contexts/MapContext";
import { setTravelRouteInformation, selectOrigin, selectDestination } from "@store/slices/navigationSlice";
import { selectRide } from "@store/slices/rideSlice";
import { selectFreight } from "@store/slices/freightSlice";
import { selectTour } from "@store/slices/tourSlice";

const { width, height } = Dimensions.get("window");

const Map = ({ initialPosition }) => {
    const [assignedDriver, setAssignedDriver] = useState(null);
    const [assignedFreightRider, setAssignedFreightRider] = useState(null);

    const { mapRef, showDirection } = useMapContext();
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const ride = useSelector(selectRide);
    const freight = useSelector(selectFreight);
    const tour = useSelector(selectTour);

    useEffect(() => {
        if (ride && (ride.status === "assigned" || ride.status === "ongoing")) {
            const driverRef = ref(dbRealtime, "Drivers/" + ride.assignedDriverPIN);
            get(driverRef).then((snapshot) => {
                const driverData = snapshot.val();
                if (driverData) {
                    setAssignedDriver(driverData);
                }
            });
        } else if (freight && (freight.status === "accepted" || freight.status === "ongoing")) {
            const freightRiderRef = ref(dbRealtime, "FreightRiders/" + freight.riderID);
            get(freightRiderRef).then((snapshot) => {
                const freightRiderData = snapshot.val();
                if (freightRiderData) {
                    setAssignedFreightRider(freightRiderData);
                }
            });
        }
    }, [ride.assignedDriverPIN, freight.riderID]);

    const getRouteInfo = (args) => {
        if (args && (origin || destination)) {
            dispatch(
                setTravelRouteInformation({
                    distance: args.distance,
                    duration: args.duration,
                }),
            );
        }
    };

    const centerCameraOnRoute = (result) => {
        mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: {
                top: height / 90,
                bottom: height / 100,
                left: width / 90,
                right: width / 90,
            },
            animated: true,
        });
    };

    return (
        <>
            {(freight.status === "fetching" || ride.status === "fetching") && (
                <>
                    <View style={styles.loadingContainer}></View>
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color="#A7E92F" />
                        <Text style={styles.loadingText}>Connecting to a nearby driver...</Text>
                    </View>
                </>
            )}
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialPosition}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}
                zoomControlEnabled={false}
            >
                {tour && tour.origin && tour.destination && (
                    <>
                        <Marker
                            coordinate={{ latitude: tour?.origin.latitude, longitude: tour?.origin.longitude }}
                            pinColor="#007ACC"
                        >
                            <Callout style={styles.callout}>
                                <Text style={styles.calloutText}>{tour.origin.locationName}</Text>
                            </Callout>
                        </Marker>

                        <Marker
                            coordinate={{
                                latitude: tour?.destination.latitude,
                                longitude: tour?.destination.longitude,
                            }}
                            pinColor="red"
                        >
                            <Callout style={styles.callout}>
                                <Text style={styles.calloutText}>{tour.destination.locationName}</Text>
                            </Callout>
                        </Marker>
                        <MapViewDirections
                            origin={{
                                latitude: tour?.origin.latitude,
                                longitude: tour?.origin.longitude,
                            }}
                            destination={{
                                latitude: tour?.destination.latitude,
                                longitude: tour?.destination.longitude,
                            }}
                            apikey={GOOGLE_MAPS_API_KEY}
                            mode="DRIVING"
                            strokeColor="#000"
                            strokeWidth={2}
                            onReady={(result) => centerCameraOnRoute(result)}
                        />
                    </>
                )}
                {(ride || freight || tour) && !tour.isBooked && origin && (
                    <Marker coordinate={origin} pinColor="#A7E92F" />
                )}
                {(ride || freight) && destination && <Marker coordinate={destination} />}
                {(ride || freight) && origin && destination && showDirection && (
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_API_KEY}
                        mode="DRIVING"
                        strokeColor="#000"
                        strokeWidth={2}
                        precision="high"
                        optimizeWaypoints={true}
                        onReady={getRouteInfo}
                    />
                )}
                {ride && (ride.status === "assigned" || ride.status === "ongoing") && assignedDriver && (
                    <>
                        <Marker
                            coordinate={{
                                latitude: assignedDriver?.location.latitude,
                                longitude: assignedDriver?.location.longitude,
                            }}
                        >
                            <MaterialIcons
                                name="directions-car"
                                size={32}
                                color="#000"
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: "#fff",
                                }}
                            />
                        </Marker>
                        <MapViewDirections
                            origin={{
                                latitude: assignedDriver?.location.latitude,
                                longitude: assignedDriver?.location.longitude,
                            }}
                            destination={origin}
                            apikey={GOOGLE_MAPS_API_KEY}
                            mode="DRIVING"
                            strokeColor="#000"
                            strokeWidth={2}
                            precision="high"
                            optimizeWaypoints={true}
                            onReady={getRouteInfo}
                        />
                    </>
                )}
                {freight && (freight.status === "accepted" || freight.status === "ongoing") && assignedFreightRider && (
                    <>
                        <Marker
                            coordinate={{
                                latitude: assignedFreightRider?.location.latitude,
                                longitude: assignedFreightRider?.location.longitude,
                            }}
                        >
                            <MaterialIcons
                                name="directions-car"
                                size={32}
                                color="#000"
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: "#fff",
                                }}
                            />
                        </Marker>
                        <MapViewDirections
                            origin={{
                                latitude: assignedFreightRider?.location.latitude,
                                longitude: assignedFreightRider?.location.longitude,
                            }}
                            destination={origin}
                            apikey={GOOGLE_MAPS_API_KEY}
                            mode="DRIVING"
                            strokeColor="#000"
                            strokeWidth={2}
                            precision="high"
                            optimizeWaypoints={true}
                            onReady={getRouteInfo}
                        />
                    </>
                )}
            </MapView>
        </>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    callout: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    calloutText: {
        fontSize: 16,
        fontFamily: "SatoshiMedium",
    },
    loadingContainer: {
        position: "absolute",
        width: "100%",
        height: "85%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 2,
    },
    loadingContent: {
        position: "absolute",
        top: "40%",
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 3,
    },
    loadingText: {
        color: "#000",
        paddingTop: 20,
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "SatoshiBold",
    },
});

export default Map;
