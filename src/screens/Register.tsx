import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { VStack } from "native-base";
import { useState } from "react";
import { Alert } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();
  function handleNewOrderRegister() {
    if (!description || !patrimony) {
      return Alert.alert("Register", "Fill in all fields");
    }
    setIsLoading(true);

    firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Register", "Request made successfully 😀");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        Alert.alert("Solicitation", "Sorry, unable to register request");
      });
  }
  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="New register" />

      <Input placeholder="Patrimony number" onChangeText={setPatrimony} />

      <Input
        placeholder="Problem description"
        mt={5}
        flex={1}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button
        title="Register"
        mt={5}
        onPress={handleNewOrderRegister}
        isLoading={isLoading}
      />
    </VStack>
  );
}
