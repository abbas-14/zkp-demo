var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import { execSync } from 'child_process';
import { initialize } from "zokrates-js";
const FILES = {
    proof: './op/verifier/proof.json',
    vk: './op/verifier/verification.key',
};
const SRC = `def main(private field[9] sq, field sum) { bool sum_ok = sq[0] + sq[1] + sq[2] == sum && sq[3] + sq[4] + sq[5] == sum && sq[6] + sq[7] + sq[8] == sum && sq[0] + sq[3] + sq[6] == sum && sq[1] + sq[4] + sq[7] == sum && sq[2] + sq[5] + sq[8] == sum && sq[0] + sq[4] + sq[8] == sum && sq[2] + sq[4] + sq[6] == sum; assert(sum_ok); return; }`;
function writeToFile(data, file) {
    console.log('writing to:', file);
    if (data instanceof Object && typeof data != 'string')
        data = JSON.stringify(data);
    fs.writeFileSync(file, data);
}
function genAndDeploy() {
    const orgDir = process.cwd();
    process.chdir('./op/verifier/bchain');
    console.log('Generating verifier.sol..');
    execSync('sh gen_verifier_sol.sh', { stdio: 'inherit' });
    // execSync(`cp build/contracts/Verifier.json ${orgDir}/../src/abi/verify.abi.json`, {stdio: 'inherit'})
    const abi = JSON.stringify(JSON.parse(fs.readFileSync('build/contracts/Verifier.json').toString()).abi);
    const op = execSync('truffle migrate --network dev', { stdio: 'pipe' }).toString();
    process.chdir(orgDir);
    const addrMatch = op.match(/Contract deployed at address: (0x[a-fA-F0-9]{40})/);
    if (addrMatch && addrMatch[1]) {
        const ctAddr = addrMatch[1];
        console.log('contract deployed at:', ctAddr);
        return { ctAddr, abi };
    }
    console.log('contract deployed failed probably!.');
    return '';
}
function initHandler(zkProvider, inputArgs) {
    const artifacts = zkProvider.compile(SRC);
    const args = [inputArgs.slice(0, 9), inputArgs.slice(9)[0]];
    console.log('IP:', args);
    console.log('abi:', artifacts.abi);
    console.log('cc:', artifacts.constraintCount);
    const { witness, output } = zkProvider.computeWitness(artifacts, args);
    console.log('op:', output);
    const keys = zkProvider.setup(artifacts.program);
    writeToFile(keys.vk, FILES.vk);
    const proof = zkProvider.generateProof(artifacts.program, witness, keys.pk);
    writeToFile(proof, FILES.proof);
    console.log('proof generated.');
    return proof;
}
// to b called by api handler
export const runForProof = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zkProvider = yield initialize();
        const proof = initHandler(zkProvider, data);
        const ob = genAndDeploy();
        return { proof, ctAddr: ob.ctAddr, abi: ob.abi };
    }
    catch (e) {
        console.log(e);
        return null;
    }
});
