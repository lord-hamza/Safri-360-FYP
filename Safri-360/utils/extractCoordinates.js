// extract the current location coordinates (latitude and longitude) from the position object:
export const extractCoordinates = (position) => {
    const latitude = position?.coords?.latitude;
    const longitude = position?.coords?.longitude;
    return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
    };
};
