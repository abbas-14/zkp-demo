import {ethers} from 'ethers'

import cABI from './abi/verify.abi.json'

const cAddr = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

export const callFunc = async proof => {
  try {
    if(!window.ethereum) {
      throw new Error('no eth wallet installed!')
    }

    await window.ethereum.request({method: 'eth_requestAccounts'})
    const provdr = new ethers.BrowserProvider(window.ethereum)
    const signer = provdr.getSigner()
    const ct = new ethers.Contract(cAddr, cABI, signer)
    const args = [
      {
        a: proof.a,
        b: proof.b,
        c: proof.c,
      }
    ]

    if(proof.inputs.length != 0) args.push(proof.inputs)

    const isValid = ct.verifyTx(...args)
    
    return isValid
  } catch(e) {
    throw new Error(e)
  }
}
