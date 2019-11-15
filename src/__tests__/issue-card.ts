import { AntiFraudRegistry } from '../index'

test(`should mark a card as issued`, async () => {

  const userAddress = "0xB82693B2464ab4992689D933861939aB2ec0bE60"
  const cardType = "student_discount_card"

  const statusChecker = new AntiFraudRegistry("your private key here")
  const txHash = await statusChecker.registerCard(userAddress, cardType)

  console.log(`\n\n\ncard issued with tx: ${txHash}\n\n\n`)
})
