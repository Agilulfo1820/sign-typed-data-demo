// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract EtherMail712 is EIP712 {
    using ECDSA for bytes32;

    string private constant SIGNING_DOMAIN = "Ether Mail";
    string private constant SIGNATURE_VERSION = "1";

    struct Person {
        string name;
        address wallet;
    }

    struct Mail {
        Person from;
        Person to;
        string contents;
    }

    constructor() EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {}

    // Hash function for Person struct
    function hashPerson(Person memory person) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("Person(string name,address wallet)"),
                    keccak256(bytes(person.name)),
                    person.wallet
                )
            );
    }

    // Hash function for Mail struct
    function hashMail(Mail memory mail) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "Mail(Person from,Person to,string contents)Person(string name,address wallet)"
                        ),
                        hashPerson(mail.from),
                        hashPerson(mail.to),
                        keccak256(bytes(mail.contents))
                    )
                )
            );
    }

    // Function to verify a Mail message with a signature
    function verify(
        Mail memory mail,
        bytes memory signature,
        address expectedSigner
    ) public view returns (bool) {
        bytes32 digest = hashMail(mail);
        address signer = digest.recover(signature);
        return signer == expectedSigner;
    }

    // Example function that processes a message
    function sendMail(
        Person memory from,
        Person memory to,
        string memory contents,
        bytes memory signature
    ) public {
        Mail memory mail = Mail(from, to, contents);
        require(verify(mail, signature, from.wallet), "Invalid signature");

        // Process the mail (e.g., emit an event)
        emit MailSent(from.wallet, to.wallet, contents);
    }

    event MailSent(address indexed from, address indexed to, string contents);
}
