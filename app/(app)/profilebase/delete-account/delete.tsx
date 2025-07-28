import { View, Text } from "react-native";
import React from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { Image } from "expo-image";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import { useMutation } from "@apollo/client";
import { ACCOUNT_DELETE_REQUEST } from "@/graphql/mutations/user.mutate";
import ToastMsg from "@/components/shared/ToastMsg";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";

const DeleteAccount = () => {
  const statusBarHeight = useStatusBarHeight();

  const [RequestAccountDelete, { loading }] = useMutation(
    ACCOUNT_DELETE_REQUEST,
    {
      onError: (error) => {
        ToastMsg(error.message, "Account Delete Request");
      },
      onCompleted: (data) => {
        if (data.AccountDeleteRequest) {
          //  make toast
          ToastMsg("OTP Sent", "OTP Sent", "success");
          router.push("/profilebase/delete-account/confirm-delete");
        } else {
          ToastMsg("Something went wrong, please try again!", "Error");
        }
      },
    }
  );

  return (
    <View
      style={{ paddingTop: statusBarHeight }}
      className="bg-Danger flex-1 dark:bg-DangerDark"
    >
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-black">
        <BackButtonBg
          className="bg-Danger/10 dark:bg-Danger/50"
          iconColor="#E41D12"
        />

        <View className="mt-5 items-center justify-center">
          <Image
            style={{
              width: "100%",
              height: "40%",
            }}
            source={require("@/assets/icons/delete-icon.png")}
            contentFit="contain"
          />
          <Text className="font-montserratExtraBold py-2 text-Danger text-lg">
            Delete Your Account
          </Text>
          <Text className="font-montserratRegular dark:text-gray-50">
            A Permanent Action
          </Text>
          <Text className="font-montserratRegular text-md text-center pt-4 mb-10 px-2 dark:text-gray-50">
            You are about to permanently delete your account. This action cannot
            be undone. All your data, settings, and saved preferences will be
            lost. You will no longer have access to your account, and any
            associated information will be removed from our system. If you are
            certain, proceed with caution
          </Text>

          {loading ? (
            <CustomActivityIndicator />
          ) : (
            <Button
              fullWidth
              size="medium"
              title="Proceed"
              textSize="text-lg"
              borderRadius="rounded-2xl"
              color="bg-Danger"
              onPress={RequestAccountDelete}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default DeleteAccount;
