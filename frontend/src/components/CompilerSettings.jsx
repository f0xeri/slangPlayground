import {
    Box,
    Button,
    Center,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useToast
} from "@chakra-ui/react";
import {CODE_SNIPPETS} from "../constants";
import LZString from "lz-string"

const examples = Object.entries(CODE_SNIPPETS);
const ACTIVE_COLOR = "blue.400";

const CompilerSettings = ({example, onSelect, value}) => {
    const toast = useToast();
    const getBasePath = () => {
        const { origin, pathname } = new URL(window.location.href);
        return origin;
    };

    const onShare = () => {
        const basePath = getBasePath();
        // use data uri
        const compressed = LZString.compressToEncodedURIComponent(value);
        const url = `${basePath}?source=${compressed}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Share",
            description: "Link copied to clipboard",
            status: "success",
            duration: 6000,
        });
    };

    return (
        <Box ml={2} mb={4}>
            <Center>
                <Text mb={2} fontSize="lg">
                    Select example
                </Text>
            </Center>
            <Center>
                <Menu isLazy>
                    <MenuButton as={Button}>{example}</MenuButton>
                    <MenuList bg="#242424">
                        {examples.map(([name, code]) => (
                            <MenuItem
                                key={name}
                                color={name === example ? ACTIVE_COLOR : ""}
                                bg={name === example ? "gray.900" : "transparent"}
                                _hover={{
                                    color: ACTIVE_COLOR,
                                    bg: "gray.900",
                                }}
                                onClick={() => onSelect(name)}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Button ml={4} as={Button} onClick={() => onShare() }>Share</Button>
            </Center>
        </Box>
    );
}

export default CompilerSettings;