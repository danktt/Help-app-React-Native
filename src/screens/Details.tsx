import firestore from "@react-native-firebase/firestore";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import {
  CircleWavyCheck,
  ClipboardText,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderDTOs";
import { dateFormat } from "../helpers/firestoreDateFormat";
type RouterParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};
export function Details() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");

  const { orderId } = route.params as RouterParams;

  function handleOrderClosed() {
    if (!solution) {
      return Alert.alert(
        "Solution",
        "Inform the solution to close the request"
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitation", "Solicitation finished");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitation", "Could not close request");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitation" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finished" : "In progress"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipment"
          description={`Patrimony ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="Description of problem"
          description={order.description}
          icon={ClipboardText}
          footer={`Registered in ${order.when}`}
        />
        <CardDetails
          title="Solution"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Its finished in ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              bg="gray.600"
              placeholder="Description of solution"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button
          isLoading={isLoading}
          title="Finish solicitation"
          m={5}
          onPress={handleOrderClosed}
        />
      )}
    </VStack>
  );
}
