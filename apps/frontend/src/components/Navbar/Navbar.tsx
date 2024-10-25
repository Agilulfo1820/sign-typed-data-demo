import {
    Button,
    HStack,
    Heading,
    Tag,
    useBreakpointValue,
} from "@chakra-ui/react"
import { getConfig } from "@repo/config"
import { EventTypes } from "@repo/constants"
import { WalletButton } from "@vechain/dapp-kit-react"
import { useCallback, useEffect, useMemo, useState } from "react"

const transactionExample = [
    [
        {
            to: "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68",
            value: "1000000000000000000", // 1 vet
        },
    ],
    {
        signer: "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
    },
    "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127",
]

type WalletButtonsV2Props = { onChangeAccount: (account: string) => void }

const WalletButtonsV2 = ({ onChangeAccount }: WalletButtonsV2Props) => {
    const [currentAccount, setCurrentAccount] = useState<string | undefined>()

    const handleChangeAccount = useCallback(
        async (account: string) => {
            setCurrentAccount(account)
            onChangeAccount(account)
        },
        [onChangeAccount],
    )

    const onAccountsChanged = useCallback(async () => {
        if (window.vechain)
            await window.vechain.on(
                EventTypes.AccountsChanged,
                (accounts: string[] = []) => {
                    handleChangeAccount(accounts[0])
                },
            )
    }, [handleChangeAccount])

    const onRequestAccounts = useCallback(async () => {
        if (window.vechain) {
            const accounts = await window.vechain.request({
                method: "eth_requestAccounts",
            })
            console.log(`🚀 ~ accounts:`, accounts)
            handleChangeAccount(accounts[0])
            onAccountsChanged()
        }
    }, [onAccountsChanged, handleChangeAccount])

    const onSendTransaction = useCallback(async () => {
        if (window.vechain) {
            const res = await window.vechain.request({
                method: "thor_sendTransaction",
                params: transactionExample,
            })
            console.log(`🚀 ~ res:`, res)
            onAccountsChanged()
        }
    }, [onAccountsChanged])

    const isDisabled = useMemo(() => Boolean(currentAccount), [currentAccount])

    return (
        <>
            <Button
                fontSize={"small"}
                isDisabled={isDisabled}
                _disabled={{ pointerEvents: "none" }}
                onClick={isDisabled ? undefined : onRequestAccounts}>
                {currentAccount || "Connect Wallet V2"}
            </Button>
            <Button colorScheme="blue" size="sm" onClick={onSendTransaction}>
                Send transaction V2
            </Button>
        </>
    )
}

export const Navbar = ({ onChangeAccount }: WalletButtonsV2Props) => {
    return (
        <>
            <HStack
                justify={"space-between"}
                p={2}
                borderBottom={"1px solid #EEEEEE"}>
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
                <HStack h={"full"}>
                    <WalletButtonsV2 onChangeAccount={onChangeAccount} />
                </HStack>
            </HStack>
        </>
    )
}
