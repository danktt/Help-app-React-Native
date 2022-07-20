import auth from "@react-native-firebase/auth";
import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";
import { Alert } from "react-native";
import Logo from "../assets/logo_primary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
export function SignIn() {
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) {
      return Alert.alert("Inform you e-mail and password");
    }
    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === "auth/invalid-email") {
          return Alert.alert("SignIn", "E-mail or password invalid");
        }
        if (error.code === "auth/wrong-password") {
          return Alert.alert("SignIn", "E-mail or password invalid");
        }
        if (error.code === "auth/user-not-found") {
          return Alert.alert("SignIn", "User not found");
        }

        return Alert.alert("SignIn", "Sorry, some wrong");
      });
  };

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Access your account
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        mb={8}
        placeholder="Password"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <Button
        title="Entrar"
        w={"full"}
        onPress={handleSubmit}
        isLoading={isLoading}
      />
    </VStack>
  );
}
