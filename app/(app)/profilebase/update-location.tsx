import { View, Text, KeyboardAvoidingView, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageTitle from "@/components/shared/PageTitle";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "@/components/shared/Button";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_CITIES,
  GET_COUNTRIES,
  GET_STATES,
} from "@/graphql/queries/location.query";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import PopUpModalSelector from "@/components/shared/PopUpModalSelector";
import { UPDATE_USER_LOCATION } from "@/graphql/mutations/location.mutate";
import { router } from "expo-router";
import { useAuth } from "@/store/context/auth-context";
import ToastMsg from "@/components/shared/ToastMsg";

const UpdateLocation = () => {
  const { updateUser, user } = useAuth();
  const { currentLocation } = user!;

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const { loading } = useQuery(GET_COUNTRIES, {
    onError: (error) => {
      ToastMsg(error.message, "Error fetching countries");
    },
    onCompleted: (data) => {
      if (data) {
        setCountries(data.GetCountries.data);
      }
    },
  });

  const [GetStates, { loading: sloading }] = useLazyQuery(GET_STATES, {
    onError: (error) => {
      ToastMsg(error.message, "Error fetching states");
      setStates([]);
    },
    onCompleted: (data) => {
      if (data) {
        setStates(data.GetStates.data);
      }
    },
  });

  const [GetCities, { loading: cloading }] = useLazyQuery(GET_CITIES, {
    onError: (error) => {
      ToastMsg(error.message, "Error fetching cities");
    },
    onCompleted: (data) => {
      if (data) {
        setCities(data.GetCities.data);
      }
    },
  });

  const [UpdateUserLocation, { loading: uloading }] = useMutation(
    UPDATE_USER_LOCATION,
    {
      onError: (error) => {
        ToastMsg(error.message, "Error updating location");
      },
      onCompleted: (data) => {
        if (data.UpdateUserLocation.data) {
          const { country, state, city } = data.UpdateUserLocation.data;
          updateUser({
            currentLocation: {
              city,
              country,
              state,
            },
          });
          ToastMsg("Location was updated successfully", "Location");

          router.back();
        }
      },
    }
  );

  const handleSelectCountry = (item: Country) => {
    setStates([]);
    setSelectedState(null);
    setCities([]);
    setSelectedCity(null);
    setSelectedCountry(item); // Update the selected country state
    GetStates({
      variables: {
        countryId: item?.id,
      },
    });
  };

  const handleSelectState = (item: State) => {
    if (item) {
      setSelectedState(item); // Update the selected state's state
      GetCities({
        variables: {
          stateId: selectedState?.id,
        },
      });
    }
  };

  const updateLocation = () => {
    if (selectedCountry && selectedState && selectedCity) {
      UpdateUserLocation({
        variables: {
          model: {
            country: selectedCountry.name,
            state: selectedState.name,
            city: selectedCity.name,
          },
        },
      });
    } else {
      ToastMsg("Country, State and City are required!", "Location");
    }
  };

  const renderItem = ({ item }: { item: { key: string } }) => {
    switch (item.key) {
      case "header":
        return (
          <>
            {/* Page title */}
            <PageTitle title="Update User Location" />
            <View className="items-center mt-4">
              {/* Logo Icon goes here */}
              <Image
                className="self-center"
                source={require("../../../assets/icons/location-icon.png")}
                style={{
                  width: getSize(30.2, "width"),
                  height: getSize(30.2, "width"),
                }}
              />
              <Text className="font-montserratRegular w-64 text-center py-4 text-Gray dark:text-white">
                Updating your current location will help us recommend events
                accurately for you.
              </Text>
            </View>
          </>
        );
      case "mainContent":
        return (
          <KeyboardAvoidingView>
            <View className="mx-4 mt-16">
              <View className="mb-8">
                {/* Select Country */}
                {loading ? (
                  <CustomActivityIndicator />
                ) : (
                  <>
                    <Text className="font-montserratMedium text-Primary py-2 text-lg dark:text-white">
                      {currentLocation?.country}
                    </Text>
                    <PopUpModalSelector<Country>
                      placeholder="Select Country"
                      items={countries}
                      itemLabelKey="name" // Use 'name' as the key for labels
                      onSelect={(country) => handleSelectCountry(country)}
                    />
                  </>
                )}
              </View>

              <View className="mb-8">
                {/* Select State */}
                {countries.length > 0 && sloading ? (
                  <CustomActivityIndicator />
                ) : (
                  <>
                    <Text className="font-montserratMedium text-Primary py-2 text-lg dark:text-white">
                      {currentLocation?.state}
                    </Text>
                    <PopUpModalSelector<State>
                      placeholder="Select State"
                      items={states}
                      itemLabelKey="name" // Use 'name' as the key for labels
                      onSelect={(state) => handleSelectState(state)}
                    />
                  </>
                )}
              </View>

              {/* Select City */}
              {countries.length > 0 && states.length > 0 && cloading ? (
                <CustomActivityIndicator />
              ) : (
                <>
                  <Text className="font-montserratMedium text-Primary py-2 text-lg dark:text-white">
                    {currentLocation?.city}
                  </Text>
                  <PopUpModalSelector<City>
                    placeholder="Select City"
                    items={cities}
                    itemLabelKey="name" // Use 'name' as the key for labels
                    onSelect={(city) => setSelectedCity(city)}
                  />
                </>
              )}
              <View className="mt-12">
                {uloading ? (
                  <CustomActivityIndicator />
                ) : (
                  <Button
                    onPress={updateLocation}
                    title="Update Location"
                    size="medium"
                    padding="py-6"
                    textSize="text-lg"
                    textFont="font-montserratBold"
                    color={`${
                      selectedCountry && selectedState && selectedCity
                        ? "bg-Primary"
                        : "bg-LightPrimary"
                    }`}
                  />
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        );

      default:
        return null;
    }
  };

  const data = [{ key: "header" }, { key: "mainContent" }];

  return (
    <SafeAreaView className="flex-1 px-2 pt-2 bg-white dark:bg-Dark">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

export default UpdateLocation;
