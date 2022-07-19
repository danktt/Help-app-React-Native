import { Button, IButtonProps, Text, useTheme, VStack } from "native-base";

type Props = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
};

export function Filter({ title, isActive = false, type, ...rest }: Props) {
  const { colors } = useTheme();

  const colorTypes =
    type === "open" ? colors.secondary[700] : colors.green[300];

  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colorTypes}
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text
        color={isActive ? colorTypes : "gray.300"}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  );
}
