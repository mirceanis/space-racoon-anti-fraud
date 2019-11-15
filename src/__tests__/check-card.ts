import 'jest-extended'

import { AntiFraudRegistry } from '../index'

it(`should check that card exists`, async () => {

  const userAddress = "0xB82693B2464ab4992689D933861939aB2ec0bE60"
  const cardType = "student_discount_card"


  const statusChecker = new AntiFraudRegistry()
  const result = await statusChecker.checkForExistingCard(userAddress, cardType)


  console.log(`\n\ncard_existence: ${result}\n\n\n`)

})
