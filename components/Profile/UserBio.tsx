import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { getSize } from "@/utils/useScaleSize";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/store/context/auth-context";
import { obfuscateEmail } from "@/utils/obfuscateEmail";
import * as ImagePicker from "expo-image-picker";
import useImageUploader from "@/services/useImageUploader";
import * as FileSystem from "expo-file-system";
import CustomActivityIndicator from "../shared/CustomActivityIndicator";
import { useMutation } from "@apollo/client";
import { CHANGE_PROFILE_IMG } from "@/graphql/mutations/user.mutate";
import ToastMsg from "../shared/ToastMsg";

interface UserBioProps {
  onProfilePress: () => void;
  onQRCodePress: () => void;
}
const UserBio: React.FC<UserBioProps> = ({ onProfilePress, onQRCodePress }) => {
  const { user, updateUser } = useAuth();
  const {
    uploadImage,
    loading: uploadLoading,
    uploadedImgUrl,
  } = useImageUploader();

  const [ChangeProfileImg, { loading: uloading }] = useMutation(
    CHANGE_PROFILE_IMG,
    {
      onError: (error) => {
        ToastMsg(error.message, "Change Profile Picture");
      },
      onCompleted: ({ ChangeProfileImage: { data, message } }) => {
        if (data) {
          ToastMsg(message, "Change Profile Picture", "success");
        }
      },
    }
  );

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

  useEffect(() => {
    if (!uploadedImgUrl) return;
    updateUser({ image: uploadedImgUrl });
    ChangeProfileImg({
      variables: {
        imagePath: uploadedImgUrl,
      },
    });
  }, [uploadedImgUrl]);

  return (
    <View className="items-center mt-6 flex-1 mx-2 bg-LightGray flex-row py-4 px-3 justify-between rounded-lg dark:bg-white/10">
      <View className="flex-row items-center">
        {/* Image */}
        <View>
          <View
            className="bg-Primary justify-center items-center"
            style={{
              width: getSize(16, "width"),
              height: getSize(16, "width"),
              borderRadius: 62,
              overflow: "hidden",
            }}
          >
            {uploadLoading || uloading ? (
              <CustomActivityIndicator />
            ) : (
              <Image
                source={
                  user?.image
                    ? { uri: user?.image }
                    : require("../../assets/icons/default-avatar.png")
                }
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="cover"
              />
            )}
          </View>
          <TouchableOpacity
            onPress={handleImageUpload}
            activeOpacity={0.8}
            className="absolute bg-Primary -bottom-1 rounded-full p-2 right-1 z-30"
          >
            <Ionicons name={"camera-outline"} color={"white"} size={18} />
          </TouchableOpacity>
        </View>

        {/* User name  & email*/}
        <View className="self-center w-40 ml-2">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-montserratBold dark:text-white"
          >
            {user?.name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-montserratMedium text-sm dark:text-white"
          >
            {obfuscateEmail(user?.email ?? "")}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={onQRCodePress}
          activeOpacity={0.8}
          style={{ width: getSize(12, "width"), height: getSize(12, "width") }}
          className="bg-Primary rounded-full items-center justify-center"
        >
          <Ionicons name={"qr-code-outline"} color={"white"} size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.8}
          style={{ width: getSize(12, "width"), height: getSize(12, "width") }}
          className="bg-Accent ml-2 rounded-full items-center justify-center"
        >
          <Ionicons name={"chevron-forward"} color={"black"} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserBio;
