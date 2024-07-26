import { initialize } from "zokrates-js";

const SRC = `def main(private field[9] sq, private field sum) { bool sum_ok = sq[0] + sq[1] + sq[2] == sum && sq[3] + sq[4] + sq[5] == sum && sq[6] + sq[7] + sq[8] == sum && sq[0] + sq[3] + sq[6] == sum && sq[1] + sq[4] + sq[7] == sum && sq[2] + sq[5] + sq[8] == sum && sq[0] + sq[4] + sq[8] == sum && sq[2] + sq[4] + sq[6] == sum; assert(sum_ok); return; }`

function initHandler(zkProvider: any, inputArgs: any) {
  const artifacts = zkProvider.compile(SRC)
  const args = [inputArgs.slice(0, 9), inputArgs.slice(9)[0]];
  console.log('IP:', args)
  console.log('abi:', artifacts.abi)
  console.log('cc:', artifacts.constraintCount)
  const {witness, output} = zkProvider.computeWitness(artifacts, args)
  console.log('op:', output)
  const keys = zkProvider.setup(artifacts.program)
  const proof = zkProvider.generateProof(artifacts.program, witness, keys.pk)
  console.log('proof generated.')
  return proof;
}


// to b called by api handler
export const runForProof = async (data: any) => {
  try {
    const zkProvider = await initialize()
    const proof = initHandler(zkProvider, data)
    return proof
  } catch(e) {
    console.log(e)
    return null
  }
}



