import {
  Button,
  Code,
  Flex,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import Image from "next/image";
import axios from 'axios';
import {callFunc} from '../services.ts'
import { FormEvent, useEffect, useState } from "react";
import ConclusionPicture from "../../public/conclusion.png";
import { MagicSquare } from "../components/MagicSquare";
import { MainContainer } from "../components/MainContainer";
import { SourceCodeModal } from "../components/SourceCodeModal";


const defaultValues = [
  ["", "", "7"],
  ["13", "37", ""],
  ["", "", ""],
];

const Index = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState(null);

  const [values, setValues] = useState(defaultValues);

  const onValueChange = (r: number, c: number, value: string) => {
    let newValues = values.slice();
    newValues[r][c] = value;
    setValues(newValues);
  };

  const toast = useToast();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setProof(null);

    setTimeout(async () => {
      try {
        const inputs = values.flat();
        // here consume the API for generating proof
        // if there is not 200 ok from backend, handle it here
        //
        let resp = await axios.post('http://localhost:3001/api/prove', { data: [...inputs, "111"] });
        console.log('response from api: ', resp)
        resp = resp.data.proof ? resp.data.proof : resp.data
        if(resp.proof) {
          localStorage.setItem('abi', resp.abi)
          localStorage.setItem('ctaddr', resp.ctAddr)
          setProof({ proof: resp.proof });
          toast({
            title: "Yay!",
            description: "Your solution is correct :)",
            position: "top",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Whoops!",
            description: resp.msg == 'proof-err' ? "Your solution is incorrect :(" : resp.msg,
            position: "top",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (e) {
        console.error(e);
        toast({
          title: "Whoops!",
          description: e.toString(),
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }

      setIsLoading(false);
    }, 100);
  };

  const verify = () => {
    setIsLoading(true);
    setTimeout(async () => {
      let isErr = !1;
      let ermsg = 'Verification failed!'
      try {
        // here interact with the deployed verifier contract
        //
        //
        
        const isValid = await callFunc(proof)
        console.log('response from chain: ', isValid)
        isErr = !isValid
      } catch (e) {
        console.error(e);
        isErr = !0
        ermsg = e.toString()
      }
      if(isErr) {
        toast({
          title: "Whoops!",
          description: ermsg,
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Yes!",
          description: "Shaam successfully verified Raam's proof :)",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }, 100);
  };

  const { nextStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  const resetSteps = () => {
    setValues(defaultValues);
    setProof(null);
    setIsLoading(false);
    reset();
  };

  return (
    <MainContainer p={4} justifyContent="center" bg="white" maxWidth="48rem">
      <Steps activeStep={activeStep} orientation="vertical">
        <Step label="Raam (the prover)" key="prover" py={2}>
          <form onSubmit={(e) => onSubmit(e)}>
            <Stack spacing="1.5rem" width="100%" alignItems="center" p={1}>
              <Flex direction="column" alignItems="center">
                <MagicSquare
                  values={values}
                  onValueChange={(r, c, v) => onValueChange(r, c, v)}
                  marginBottom={2}
                />
              </Flex>
              <Text color="text" fontSize="lg">
                This is a{" "}
                <Text as="span" fontWeight="bold">
                  Magic Square
                </Text>
                . This means that the numbers add up to the same total in every
                direction. Every row, column and diagonal should add up to{" "}
                <Code>111</Code>. Fill the missing fields and prove to the
                verifier that you know the solution without revealing the
                values!
              </Text>
              <Flex gap={2} flexWrap={"wrap"}>
                <Button
                  isLoading={isLoading}
                  loadingText="Proving..."
                  colorScheme="teal"
                  variant="solid"
                  type="submit"
                >
                  Generate a proof
                </Button>
                { proof && <SourceCodeModal source={proof} /> }
              </Flex>
              {proof && (
                <Flex maxW="100%" direction="column">
                  <Code
                    whiteSpace="pre"
                    overflow="scroll"
                    textAlign="left"
                    p={2}
                    mb={2}
                  >
                    {JSON.stringify(proof.zokratesProof, null, 2)}
                  </Code>
                  <Button
                    variant="solid"
                    type="button"
                    colorScheme="teal"
                    onClick={nextStep}
                  >
                    Next step
                  </Button>
                </Flex>
              )}
            </Stack>
          </form>
        </Step>
        <Step label="Shaam (the verifier)" key="verifier" py={2}>
          <Stack
            spacing="1.5rem"
            width="100%"
            maxWidth="48rem"
            alignItems="center"
            p="1rem"
          >
            <Image src={ConclusionPicture} alt="conclusion" />
            <Text color="text" fontSize="lg">
              Did Peggy run the computation successfully? Does Peggy know the
              right solution? Good questions, let's find out.
            </Text>
            <Flex gap={2}>
              <Button
                isLoading={isLoading}
                loadingText="Verifying..."
                colorScheme="teal"
                variant="solid"
                type="button"
                onClick={verify}
              >
                Verify
              </Button>
              <Button variant="solid" type="button" onClick={resetSteps}>
                Reset
              </Button>
            </Flex>
          </Stack>
        </Step>
      </Steps>
    </MainContainer>
  );
};

export default Index;
