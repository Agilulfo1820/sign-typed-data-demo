import { useBreakpointValue, VStack } from "@chakra-ui/react";
import { WalletButton } from "@vechain/dapp-kit-react";

export const NotConnected = () => {
  return (
    <VStack align="center" justify="center" h="full">
      <WalletButton
        mobile={useBreakpointValue({
          base: true,
          md: false,
        })}
      />
    </VStack>
  );
};
