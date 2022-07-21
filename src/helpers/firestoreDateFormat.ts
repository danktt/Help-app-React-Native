import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export function dateFormat(timestamp: FirebaseFirestoreTypes) {
  if (timestamp) {
    const date = new Date(timestamp.toDate());

    const day = date.toLocaleDateString("pt-BR");
    const hour = date.toLocaleDateString("pt-BR");

    return `${day} at ${hour}`;
  }
}
