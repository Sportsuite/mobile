interface ReverseGeocode {
  city: string | null;
  country: string | null;
  district: string | null;
  formattedAddress: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  streetNumber: string | null;
  subregion: string | null;
  timezone: string | null;
}

// For the array response type:
type ReverseGeocodeArray = ReverseGeocode[];
