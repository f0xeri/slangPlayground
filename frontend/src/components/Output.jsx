import {useState} from "react";
import {Box, Button, Center, Text, useToast} from "@chakra-ui/react";

const Output = ({editorRef, language}) => {
    const toast = useToast();
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const executeCode = async (sourceCode) => {
        // fetch localhost:6002/compile, pass source code as body (raw text)
        const response = await fetch("/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: sourceCode,
        });
        return response.json();
    }

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const result = await executeCode(sourceCode);
            const fullRes = result.errors.concat(result.output.stderr).concat(result.output.stdout);
            console.log(fullRes)
            setOutput(result);
            result.stderr ? setIsError(true) : setIsError(false);
        } catch (error) {
            console.log(error);
            toast({
                title: "An error occurred.",
                description: error.message || "Unable to run code",
                status: "error",
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="50%" textAlign="left">
            <Center>
                <Text mb={2} fontSize="lg" align="center">
                    Output
                </Text>
            </Center>
            <Center>
                <Button
                    variant="outline"
                    colorScheme="green"
                    mb={4}
                    isLoading={isLoading}
                    onClick={runCode}
                >
                    Run Code
                </Button>
            </Center>
            <Box
                overflowY="auto"
                height="75vh"
                p={2}
                color={isError ? "red.400" : ""}
                border="1px solid"
                borderRadius={4}
                borderColor={isError ? "red.500" : "#333"}
                css={{
                    '&::-webkit-scrollbar': {
                        width: '14px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#4f4f4f',

                    },
                }}
            >
                {output ? (
                    <pre style={{whiteSpace: "pre-wrap"}}>
                        Compilation result:<br/><br/>
                        {output.errors}
                        <br/><br/>Execution result:<br/><br/>
                        {output.output.stderr}
                        {output.output.stdout}
                    </pre>
                ) : (
                    <pre style={{whiteSpace: "pre-wrap"}}> Click "Run Code" to see the output here</pre>
                )}
            </Box>
        </Box>
    );
};
export default Output;