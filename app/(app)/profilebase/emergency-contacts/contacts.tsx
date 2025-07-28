import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PageTitle from "@/components/shared/PageTitle";
import Contact from "@/components/Emergency/Contact";
import Button from "@/components/shared/Button";
import { router, useFocusEffect } from "expo-router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_EMERGENCY_CONTACTS } from "@/graphql/queries/emergency.query";
import ToastMsg from "@/components/shared/ToastMsg";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { DELETE_EMERGENCY_CONTACT } from "@/graphql/mutations/emergency.mutate";

export default function EmergencyContacts() {
  const statusBarHeight = useStatusBarHeight();
  const [contacts, setContacts] = useState<EContact[]>([]);

  const [getContacts, { loading }] = useLazyQuery(GET_EMERGENCY_CONTACTS, {
    onError: (error) => {
      ToastMsg(error.message, "Contacts Loading Failed");
    },
    onCompleted: ({ GetContacts: { data } }) => {
      if (data) {
        setContacts(data);
      }
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [DeleteContact, { loading: dloading }] = useMutation(
    DELETE_EMERGENCY_CONTACT,
    {
      onError: (error) => {
        ToastMsg(error.message, "Delete Emergency Contact Failed");
      },
      onCompleted: ({ DeleteContact: { message } }) => {
        if (message) {
          ToastMsg(message, "Emergency Contact", "success");
          getContacts();
        }
      },
    }
  );

  useFocusEffect(
    useCallback(() => {
      getContacts();
    }, [])
  );
  return (
    <View
      className="bg-Primary flex-1 dark:bg-black"
      style={{ paddingTop: statusBarHeight }}
    >
      <PageTitle
        containerStyle="px-2 mb-4"
        title="Emergency Contacts"
        className="text-white px-2"
        bgBack
      />
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-Primary/10">
        {/* List description and refresh button */}
        <View className="flex-row items-center justify-between py-2 mb-4">
          <Text className="font-montserratRegular text-gray-500 dark:text-white">
            List of contacts
          </Text>
          <Text
            onPress={() => getContacts()}
            className="text-Primary font-montserratBold dark:text-Accent"
          >
            Refresh
          </Text>
        </View>

        {/* Contact list items here */}
        {loading || dloading ? (
          <CustomActivityIndicator
            className="justify-center items-center py-32"
            size="large"
          />
        ) : (
          contacts.map((c, index) => {
            return (
              <Contact
                onDelete={(c) => {
                  DeleteContact({
                    variables: {
                      deleteContactId: c.id,
                    },
                  });
                }}
                onEdit={(c: EContact) => {
                  router.navigate({
                    pathname:
                      "/profilebase/emergency-contacts/new-update-contact",
                    params: { currentUser: JSON.stringify(c) },
                  });
                }}
                item={c}
                key={index}
              />
            );
          })
        )}

        <View className="absolute bottom-10 right-0 left-0 mx-2">
          {/* Add new contact button */}
          <Button
            onPress={() =>
              router.navigate(
                "/profilebase/emergency-contacts/new-update-contact"
              )
            }
            title="Add New Contact"
            size="medium"
            padding="py-6"
            textSize="text-lg"
            textFont="font-montserratBold"
            color={"bg-Primary"}
          />
          <Text className="font-montserratRegular text-center text-sm p-2 dark:text-stone-50">
            Add a trusted contact we can reach in case of an emergency during
            your trip. This helps keep you safe while attending F1 events.
          </Text>
        </View>
      </View>
    </View>
  );
}
