import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { dbRealtime } from "../../firebase/config";
import { ref, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import haversine from "haversine";

import { setTour } from "@store/slices/tourSlice";
import { selectCurrentUserLocation } from "@store/slices/locationSlice";

const DestinationPicker = () => {
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);

    const currentUserLocation = useSelector(selectCurrentUserLocation);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUserLocation) {
            getNearbyTours(currentUserLocation);
        }
    }, [currentUserLocation]);

    // query nearby tours: get tours within 5km radius (haversine formula)
    const getNearbyTours = (currentLocation) => {
        const toursRef = ref(dbRealtime, "Tours");
        onValue(toursRef, (snapshot) => {
            const toursData = snapshot.val();
            if (toursData) {
                const tours = Object.values(toursData);
                if (!tours) return setDestinations([]);
                const availableTours = [];
                tours.forEach((tourProvider) => {
                    const providerTours = tourProvider.Tours;
                    const toursList = Object.values(providerTours);
                    toursList.forEach((tour) => {
                        if (tour.tourSeatsLeft > 0 && tour.tourBookingStatus === "Open") {
                            const tourLocation = {
                                latitude: tour.tourPickup.latitude,
                                longitude: tour.tourPickup.longitude,
                            };
                            if (haversine(currentLocation, tourLocation) <= 5) {
                                availableTours.push(tour);
                            }
                        }
                    });
                });
                setDestinations(availableTours);
                setFilteredDestinations(availableTours);
            } else {
                console.log("No tours available.");
            }
        });
    };

    const handleDestinationChange = (item) => {
        dispatch(
            setTour({
                id: item.tourID,
                name: item.tourName,
                fare: item.tourFare,
                origin: item.tourPickup,
                destination: item.tourDestination,
                departure: item.tourDepartureTime,
                startDate: item.tourStartDate,
                companyName: item.companyName,
            }),
        );
        setSelectedDestination(item);
        setIsFocus(false);
    };

    const handleSearch = (text) => {
        if (text) {
            const filtered = destinations.filter((destination) => {
                const locationName = destination.tourDestination.locationName
                    .toLowerCase()
                    .includes(text.toLowerCase());
                return locationName;
            });
            setFilteredDestinations(filtered);
        } else {
            setFilteredDestinations(destinations);
        }
    };

    return (
        <>
            <View style={styles.main}>
                <Dropdown
                    label="Destination"
                    mode="modal"
                    data={filteredDestinations}
                    labelField="tourName"
                    valueField="tourName"
                    value={selectedDestination?.tourName}
                    showsVerticalScrollIndicator={false}
                    placeholder="Choose a destination"
                    maxHeight={400}
                    search={true}
                    searchField="tourName"
                    searchPlaceholder="Search for a destination"
                    renderInputSearch={() => (
                        <View style={styles.searchBarContainer}>
                            <Ionicons name="search-outline" size={24} color="gray" style={styles.searchBarIcon} />
                            <TextInput
                                style={styles.searchBar}
                                placeholder="Search for a destination"
                                placeholderTextColor="gray"
                                onChangeText={handleSearch}
                            />
                        </View>
                    )}
                    searchQuery={handleSearch}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={handleDestinationChange}
                    renderRightIcon={() => (
                        <Ionicons
                            name="chevron-forward-circle-outline"
                            size={25}
                            color="gray"
                            style={styles.iconStyle}
                        />
                    )}
                    renderItem={(item, index) => (
                        <View
                            key={index}
                            style={[styles.itemContainer, isFocus === index && { backgroundColor: "#c8c7cc" }]}
                        >
                            <View style={styles.itemContainerRow}>
                                <Text style={styles.itemNameText}>{item?.tourName}</Text>
                                <Text style={styles.itemDateText}>
                                    {item?.tourStartDate} - {item?.tourEndDate}
                                </Text>

                                <Text style={styles.itemlocationText}>
                                    <Ionicons name="location-outline" size={22} color="orange" /> Pickup:{" "}
                                    {item?.tourPickup.locationName}
                                </Text>
                                <Text style={styles.itemlocationText}>
                                    <Ionicons name="location-outline" size={22} color="green" /> Destination:{" "}
                                    {item?.tourDestination.locationName}
                                </Text>
                                <Text style={styles.itemSeatsText}>{item?.tourSeatsLeft} seats left</Text>
                            </View>
                        </View>
                    )}
                    itemContainerStyle={styles.itemContainerStyle}
                    containerStyle={styles.container}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholderStyle={styles.placeholderStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    main: {
        height: 55,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        marginTop: 5,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        marginTop: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        fontFamily: "SatoshiMedium",
        fontWeight: "600",
        paddingHorizontal: 10,
    },
    searchBarIcon: {
        marginLeft: 5,
    },
    iconStyle: {
        position: "absolute",
        right: 10,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    itemContainerRow: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    itemNameText: {
        fontSize: 17,
        fontWeight: "600",
        fontFamily: "SatoshiBold",
        color: "#000",
    },
    itemDateText: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SatoshiMedium",
        color: "#000",
        marginVertical: 3,
    },
    itemlocationText: {
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
        color: "#000",
        marginTop: 2,
    },
    itemSeatsText: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "SatoshiBold",
        textTransform: "uppercase",
        color: "#000",
        marginTop: 7,
        marginLeft: 5,
    },
    itemContainerStyle: {
        backgroundColor: "#fff",
        paddingHorizontal: 5,
        borderBottomWidth: 0.5,
        borderColor: "#ccc",
    },
    container: {
        position: "relative",
        width: "100%",
        height: 500,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    selectedTextStyle: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    placeholderStyle: {
        color: "#9c9c9c",
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
    },
    inputSearchStyle: {
        fontSize: 15,
        fontWeight: "600",
        fontFamily: "SatoshiMedium",
        paddingHorizontal: 10,
        flex: 1,
    },
});

export default DestinationPicker;
