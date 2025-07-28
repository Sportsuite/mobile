// Interface for a single transportation configuration
interface TransportationConfig {
  id: string; // Unique identifier for the configuration
  title: string; // Title of the transportation option
  desc: string; // Description of the transportation option
  price: number; // Price of the transportation option
}

// Interface for the `data` field in the response
interface TransportationConfigData {
  data: TransportationConfig[]; // Array of transportation configurations
}

// Interface for the entire response
interface GetTransportationConfigsResponse {
  GetTransportationConfigs: TransportationConfigData; // The response wraps the data in `GetTransportationConfigs`
}
