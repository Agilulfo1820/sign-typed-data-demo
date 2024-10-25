import { Box, Container, VStack } from "@chakra-ui/react"
import { Home } from "./pages/Home"
import { useWallet } from "@vechain/dapp-kit-react"
import { Navbar } from "./components/Navbar"
import { useEffect, useMemo, useState } from "react"

function App() {
    const { account: accountV1 } = useWallet()
    const [accountV2, setAccountV2] = useState<string | undefined>()

    const account = useMemo(
        () => accountV1 || accountV2,
        [accountV1, accountV2],
    )

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).connectedWallet = account
    }, [account])

    return (
        <Box h="full" bgColor="#f7f7f7">
            <VStack h="100vh" align="stretch" gap="0">
                <Navbar
                    onChangeAccount={acc => {
                        setAccountV2(acc)
                    }}
                />
                <VStack align="stretch" flex="1" overflowY={"auto"} py={4}>
                    <Container maxW="container.lg" h="full">
                        <VStack align="stretch">{account && <Home />}</VStack>
                    </Container>
                </VStack>
            </VStack>
        </Box>
    )
}

export default App
