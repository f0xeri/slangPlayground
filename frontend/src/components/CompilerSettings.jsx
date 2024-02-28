import { useState } from "react";
import {Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, useToast} from "@chakra-ui/react";

import { CODE_SNIPPETS } from "../constants";
const examples = Object.entries(CODE_SNIPPETS);
const ACTIVE_COLOR = "blue.400";

const CompilerSettings = ({example, onSelect}) => {
    return (
        <Box ml={2} mb={4}>
            <Text mb={2} fontSize="lg">
                Example:
            </Text>
            <Menu isLazy>
                <MenuButton as={Button}>{example}</MenuButton>
                <MenuList bg="#110c1b">
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
        </Box>
    );
}

export default CompilerSettings;