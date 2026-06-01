export type GeofenceCheckRequest = {
  lat: number;
  lng: number;
};

export type GeofenceCheckResponse = GeofenceCheckRequest & {
  inside: boolean;
};
