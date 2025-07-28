import Toast from "react-native-toast-message";

const ToastMsg = (message: string, title: string, type: string = "error") => {
  return Toast.show({
    type: type, // 'success' | 'error' | 'info'
    text1: title,
    text2: message,
    visibilityTime: 6000,
  });
};

export default ToastMsg;
