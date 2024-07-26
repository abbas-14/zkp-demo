
#!/bin/bash

# prover needs to compile the circuit and create the proving and verifying keys
# then prover sends the verification keys to the verifier side
# then generate the witness provided with all the inputs to the circuit
# then generate proof
# then prover sends the proof to the verifier side
#
# lets compile
OP_DIR="op/prover/"
VRF_DIR="op/verifier/"
CKT_PREF="magic_sq_mod"
IPS="31 73 7 13 37 61 67 1 43 111"
# CKT_PREF="reveal_bit"
# IPS="0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 510"
ZOK_FILE="${CKT_PREF}.zok"
CKT_BIN_FILE="${OP_DIR}${CKT_PREF}_compiled_ckt"
ABI="${OP_DIR}abi.json"
WITNESS="${OP_DIR}witness"
CIRC_WITNESS="${OP_DIR}${CKT_PREF}.wtns"
PK="${OP_DIR}proving.key"
VK="${OP_DIR}verification.key"
PROOF="${OP_DIR}proof.json"

echo ''
echo 'Generating the witness..'
echo ''
zokrates compute-witness --verbose -i $CKT_BIN_FILE -s $ABI -o $WITNESS --circom-witness $CIRC_WITNESS -a $IPS

# lets generate the proof
echo 'Generating proof..'
zokrates generate-proof -i $CKT_BIN_FILE -p $PK -w $WITNESS -j $PROOF
echo ''
echo 'Copying file to verifier side..'
echo ''
cp $PROOF $VRF_DIR
cp $VK $VRF_DIR

