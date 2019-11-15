# space-raccoon-anti-fraud
Typescript bindings for the anti-fraud layer presented in blockchain and the city challenge lyon 2019

## usage

### checking that a card has been issued
This is done by the card issuer before attempting to issue a particular discount card to a user.
This makes a call to the contract to check for the state of the `(user|card)` pair.

```typescript
const registry = new AntiFraudRegistry()

const userAddress = "0xB82693B2464ab4992689D933861939aB2ec0bE60"
const cardType = "student_discount_card"

const result = await registry.checkForExistingCard(userAddress, cardType)
```

### marking a card issuance
This is done by the card issuer to mark the issuance of a particular card with a certain validity period.
This will broadcast a transaction to the referenced contract so it requires a private key to sign the transaction.
The address corresponding to the private key needs to have sufficient gas.

```typescript
const statusChecker = new AntiFraudRegistry("card issuer private key")

const userAddress = "0xB82693B2464ab4992689D933861939aB2ec0bE60"
const cardType = "student_discount_card"
const validity = 3600 * 24 * 365

const txHash = await statusChecker.registerCard(userAddress, cardType, validity)
```
