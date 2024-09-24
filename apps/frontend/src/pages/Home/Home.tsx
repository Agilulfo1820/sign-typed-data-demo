import { VStack } from "@chakra-ui/react";
import { SignTypedDataCard } from "./components/SignTypedDataCard";

export const Home = () => {
  return (
    <VStack align="stretch" gap={4}>
      <SignTypedDataCard />
    </VStack>
  );
};
