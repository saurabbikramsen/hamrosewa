function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export const pointsWithinGivenkm = (
  data: {
    rating: number;
    visited_frequency: number;
    location: {
      latitude: number;
      longitude: number;
      id: number;
    };
  }[],
  givenLat,
  givenLon,
  radius,
) =>
  data.filter((point) => {
    const distance = calculateDistance(
      givenLat,
      givenLon,
      point.location.latitude,
      point.location.longitude,
    );
    return distance <= radius;
  });
