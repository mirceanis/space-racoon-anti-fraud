import * as EthContract from 'ethjs-contract'
import * as SignerProvider from 'ethjs-provider-signer'
import * as Account from 'ethjs-account'
import { sign } from 'ethjs-signer';
import * as AntiFraudContractABI from './contracts/space-raccoons-registry.json'
import * as HttpProvider from 'ethjs-provider-http'
import * as Eth from 'ethjs-query'
import { keccak_256 } from 'js-sha3'

const registryAddress = "0x72cbf0354f495217f64398f6c2f463aa9d1b29c2"

function configureNetwork(rpcUrl: string, privateKey?: string) {
  if (privateKey == null) {
    const provider = new HttpProvider(rpcUrl)
    const eth = new Eth(provider)
    return eth
  } else {
    const provider = new SignerProvider(rpcUrl, {
      signTransaction: (rawTx: any, cb: any) => cb(null, sign(rawTx, privateKey)),
    });
    const eth = new Eth(provider);
    return eth
  }
}

export class AntiFraudRegistry {

  private privKey? : string
  private privAddress? : string

  constructor(_privKey?: any) {
    if (_privKey) {
      const account = Account.privateToAccount(_privKey as string)
      this.privKey = account.privateKey
      this.privAddress = account.address
    }
  }

  async registerCard(userAddress : string, cardType : string, validity : number = 3600*24*30*6): Promise<string> {

    const infuraId = "471da0e50b4b4bc6ae751d6c4746cc44"
    const eth = configureNetwork(`https://rinkeby.infura.io/v3/${infuraId}`, this.privKey)

    const AntiFraudContract = new EthContract(eth)(AntiFraudContractABI)
    const statusReg = AntiFraudContract.at(registryAddress)

    const digest = Buffer.from(keccak_256.arrayBuffer(userAddress.toLowerCase() + cardType))
    const expiry = (new Date().valueOf() / 1000) + validity

    const txHash = await statusReg.issueCard(digest, expiry, { from: this.privAddress, gas: 300000})
    return txHash
  }

  async checkForExistingCard(
    userAddress: string,
    cardType: string,
  ): Promise<null | boolean> {


    const infuraId = "471da0e50b4b4bc6ae751d6c4746cc44"
    const eth = configureNetwork(`https://rinkeby.infura.io/v3/${infuraId}`)
    const AntiFraudContract = new EthContract(eth)(AntiFraudContractABI)
    const statusReg = AntiFraudContract.at(registryAddress)

    interface CardExistenceResult {
      [index: string]: boolean
    }

    const digest = Buffer.from(keccak_256.arrayBuffer(userAddress.toLowerCase() + cardType))
    console.log(`card issuance digest: ${digest.toString('hex')}`)
    try {
      const rawResult: CardExistenceResult = await statusReg.hasCard(
        digest
      )
      const hasCard: boolean = rawResult['0']
      return hasCard
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
