#!/bin/bash
#
export PATH=$PATH:/home/ant/.zokrates/bin
FILE="truffle-config.js"     
if [ ! -f $FILE ]; then
  echo 'doing truffle init..'
  truffle init
fi

echo 'Generating verifier.sol file..'
echo ''
zokrates export-verifier -i ../verification.key -o contracts/verifier.sol
# now lets compile the newly generated verifier contract
echo ''
echo 'Compiling the contract..'
echo ''
truffle compile

