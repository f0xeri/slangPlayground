import {Box, Button, Center, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";

import {CODE_SNIPPETS} from "../constants";

const examples = Object.entries(CODE_SNIPPETS);
const ACTIVE_COLOR = "blue.400";

const CompilerSettings = ({example, onSelect}) => {
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
            </Center>
        </Box>
    );
}

export default CompilerSettings;