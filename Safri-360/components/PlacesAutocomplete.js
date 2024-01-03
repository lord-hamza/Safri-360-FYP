import { GOOGLE_MAPS_API_KEY } from "@env";
import { useEffect, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const PlacesAutocomplete = ({ placeholder, onPlaceSelected, currentLocation, currentLocationLabel }) => {
    const PlacesAutocompleteRef = useRef(null);

    useEffect(() => {
        currentLocation && PlacesAutocompleteRef.current?.setAddressText("Current Location");
    }, []);

    return (
        <View style={styles.placesSearchContainer}>
            <GooglePlacesAutocomplete
                placeholder={placeholder || ""}
                ref={PlacesAutocompleteRef ? PlacesAutocompleteRef : null}
                fetchDetails={true}
                onPress={(data, details) => {
                    // console.log("DATA: ", data);
                    // console.log("\nDETAILS: ", details);
                    PlacesAutocompleteRef.current?.setAddressText(data?.structured_formatting?.main_text || "");
                    onPlaceSelected(details, data);
                }}
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: "en",
                    components: "country:pk",
                }}
                styles={{
                    textInput: {
                        backgroundColor: "#f2f2f2",
                        height: 50,
                        borderRadius: 5,
                        paddingVertical: 15,
                        paddingHorizontal: 15,
                        fontSize: 15,
                        fontWeight: "400",
                        fontFamily: "SatoshiMedium",
                        zIndex: 100,
                    },
                    listView: {
                        width: "100%",
                        maxHeight: 180,
                        overflow: "scroll",
                        zIndex: 100,
                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: "#c8c7cc",
                    },
                    loader: {
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        height: 20,
                    },
                }}
                minLength={2}
                onFail={(error) => console.log(error)}
                onNotFound={() => console.log("no results")}
                renderRow={(row) => {
                    return (
                        <View style={styles.searchItem}>
                            <Text style={styles.searchHeader}>{row?.structured_formatting?.main_text || ""}</Text>
                            <Text style={styles.searchDescription}>
                                {row?.structured_formatting?.secondary_text || ""}
                            </Text>
                        </View>
                    );
                }}
                listEmptyComponent={() => (
                    <View style={{ flex: 1 }}>
                        <Text>No results were found</Text>
                    </View>
                )}
                debounce={400}
                GooglePlacesSearchQuery={{
                    rankby: "distance",
                }}
                GooglePlacesDetailsQuery={{
                    fields: ["formatted_address", "geometry"],
                }}
                GoogleReverseGeocodingQuery={{
                    rankby: "distance",
                }}
                enablePoweredByContainer={false}
                nearbyPlacesAPI="GooglePlacesSearch"
                currentLocation={currentLocation ? true : false}
                currentLocationLabel={currentLocationLabel ? currentLocationLabel : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchItem: {
        flexDirection: "column",
        textAlign: "left",
    },
    searchHeader: {
        fontSize: 15,
        fontFamily: "SatoshiMedium",
    },
    searchDescription: {
        fontSize: 13,
        fontFamily: "Satoshi",
    },
    placesSearchContainer: {
        flexDirection: "row",
        marginTop: 3,
    },
});

export default PlacesAutocomplete;
