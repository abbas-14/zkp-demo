import {ethers} from 'ethers'

export const callFunc = async proof => {
  try {
    if(!window.ethereum) {
      throw new Error('no eth wallet installed!')
    }

    await window.ethereum.request({method: 'eth_requestAccounts'})
    const provdr = new ethers.BrowserProvider(window.ethereum)
    const signer = provdr.getSigner()
    
    const abi = localStorage.getItem('abi')
    const cAddr = localStorage.getItem('ctaddr')
    console.log('instantiating contract at:', cAddr)
    const ct = new ethers.Contract(cAddr, abi, provdr)
    proof = proof.proof
    const args = [
      {
        a: proof.proof.a,
        b: proof.proof.b,
        c: proof.proof.c,
      }
    ]
    console.log(proof, args)

    if(proof.inputs.length != 0) args.push(proof.inputs)

    console.log('Args:', args)
    const isValid = await ct.verifyTx(...args)
    
    return isValid
  } catch(e) {
    throw new Error(e)
  }
}
