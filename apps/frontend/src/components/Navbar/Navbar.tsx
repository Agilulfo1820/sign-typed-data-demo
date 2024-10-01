import {
  HStack,
  Heading,
  Tag,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { getConfig } from "@repo/config";
import { WalletButton } from "@vechain/dapp-kit-react";

export const Navbar = () => {
  return (
    <HStack justify={"space-between"} p={2} borderBottom={"1px solid #EEEEEE"}>
      <Heading size={"sm"} alignContent={"center"}>
        Demo
      </Heading>

      <HStack h={"full"}>
        <Tag colorScheme={"green"} h={"full"}>
          {getConfig(import.meta.env.VITE_APP_ENV).network.name}
        </Tag>
        <WalletButton
          mobile={useBreakpointValue({
            base: true,
            md: false,
          })}
        />
      </HStack>
    </HStack>
  );
};
