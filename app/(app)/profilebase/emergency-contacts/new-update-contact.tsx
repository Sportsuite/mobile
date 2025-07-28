import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PageTitle from "@/components/shared/PageTitle";
import { getSize } from "@/utils/useScaleSize";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import InputField from "@/components/shared/InputField";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import Button from "@/components/shared/Button";
import { useMutation } from "@apollo/client";
import {
  NEW_EMERGENCY_CONTACT,
  UPDATE_EMERGENCY_CONTACT,
} from "@/graphql/mutations/emergency.mutate";
import ToastMsg from "@/components/shared/ToastMsg";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import useImageUploader from "@/services/useImageUploader";
import * as FileSystem from "expo-file-system";

export default function NewUpdateContact() {
  const params = useSearchParams();
  const currentUser: EContact = JSON.parse(params.get("currentUser") || "null");
  const [model, setModel] = useState<Partial<EContact>>({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    relationship: currentUser?.relationship ?? "",
    image: currentUser?.image ?? "",
  });

  const {
    uploadImage,
    loading: uploadLoading,
    uploadedImgUrl,
  } = useImageUploader();

  const statusBarHeight = useStatusBarHeight();

  // Function to handle image selection
  const handleImageUpload = async () => {
    try {
      // Request permission to access the media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow access to your photos to upload an image."
        );
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatars
        quality: 1, // Highest quality
      });

      // If the user selects an image
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          uploadImage(base64Data, uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select an image. Please try again.");
    }
  };

  const [AddNewContact, { loading }] = useMutation(NEW_EMERGENCY_CONTACT, {
    onError: (error) => {
      ToastMsg(error.message, "Add Emergency Contact Failed");
    },
    onCompleted: ({ NewContact: { data, message } }) => {
      if (data) {
        ToastMsg(message, "Emergency Contact", "success");
        router.back();
      }
    },
  });

  const [UpdateContact, { loading: uloading }] = useMutation(
    UPDATE_EMERGENCY_CONTACT,
    {
      onError: (error) => {
        ToastMsg(error.message, "Update Emergency Contact Failed");
      },
      onCompleted: ({ UpdateContact: { data, message } }) => {
        if (data) {
          ToastMsg(message, "Emergency Contact", "success");
          router.back();
        }
      },
    }
  );

  useEffect(() => {
    if (!uploadedImgUrl) return;
    setModel({ image: uploadedImgUrl });
  }, [uploadedImgUrl]);

  return (
    <View
      className="bg-Primary flex-1 dark:bg-black"
      style={{ paddingTop: statusBarHeight }}
    >
      <PageTitle
        containerStyle="px-2 mb-4"
        title={currentUser ? "Update Contact" : "New Emergency Contact"}
        className="text-white px-2"
        bgBack
      />
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-Primary/10">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? statusBarHeight : 0}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="font-montserratRegular text-gray-500 py-2 dark:text-white">
              {currentUser ? "Contact Update Form" : "New Contact Form"}
            </Text>

            {/* Image */}
            <View className="items-center">
              <View
                className="bg-Primary items-center justify-center"
                style={{
                  width: getSize(35, "width"),
                  height: getSize(35, "width"),
                  borderRadius: 80,
                  overflow: "hidden",
                }}
              >
                {uploadLoading ? (
                  <CustomActivityIndicator />
                ) : (
                  <Image
                    source={
                      model.image
                        ? { uri: model.image }
                        : require("../../../../assets/icons/default-avatar.png")
                    }
                    style={{
                      width: getSize(32, "width"),
                      height: getSize(32, "width"),
                      borderRadius: 80,
                      overflow: "hidden",
                    }}
                    contentFit="cover"
                  />
                )}
              </View>
              {!uploadLoading && (
                <TouchableOpacity
                  onPress={handleImageUpload}
                  activeOpacity={0.8}
                  className="absolute bg-Primary -bottom-3 rounded-full p-2 z-80"
                >
                  <Ionicons name={"camera-outline"} color={"white"} size={20} />
                </TouchableOpacity>
              )}
            </View>

            <View className="mt-6">
              <InputField
                type="text"
                placeholder="Enter name"
                onValueChange={(name) => setModel({ ...model, name })}
                value={model.name}
                title={"Name"}
              />

              <View className="mt-6">
                <InputField
                  type="phone-pad"
                  placeholder="Enter mobile number"
                  onValueChange={(phone) => setModel({ ...model, phone })}
                  value={model.phone}
                  title={"Mobile Number"}
                />
              </View>

              <View className="mt-6">
                <InputField
                  type="text"
                  placeholder="Enter email"
                  onValueChange={(email) =>
                    setModel({ ...model, email: email.toLowerCase().trim() })
                  }
                  value={model.email}
                  title={"Email Address (Optional)"}
                />
              </View>

              <View className="my-6">
                <InputField
                  type="text"
                  placeholder="Enter relationship eg Sister/Brother"
                  onValueChange={(relationship) =>
                    setModel({ ...model, relationship })
                  }
                  value={model.relationship}
                  title={"What is your relationship with this contact?"}
                />
              </View>

              {loading || uloading ? (
                <CustomActivityIndicator className="py-4" />
              ) : (
                <Button
                  onPress={() => {
                    if (!currentUser) {
                      if (!model.name && !model.phone && !model.relationship) {
                        ToastMsg(
                          "Please fill out all fields not marked optional",
                          "Warning"
                        );
                        return;
                      }
                      AddNewContact({
                        variables: {
                          model,
                        },
                      });
                    } else {
                      UpdateContact({
                        variables: {
                          updateContactId: currentUser.id,
                          model,
                        },
                      });
                    }
                  }}
                  title={currentUser ? "Update Contact" : "Save Contact"}
                  size="medium"
                  padding="py-6"
                  textSize="text-lg"
                  borderRadius="rounded-xl"
                  textFont="font-montserratBold"
                  color={`${
                    model.name && model.phone && model.relationship
                      ? "bg-Primary"
                      : "bg-LightPrimary"
                  }`}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
