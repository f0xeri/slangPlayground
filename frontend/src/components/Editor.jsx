import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import CompilerSettings from "./CompilerSettings";
import monaco from "monaco-editor";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [example, setExample] = useState("Hello, World!");

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (example) => {
        setExample(example);
        setValue(CODE_SNIPPETS[example]);
    };

    const addSlang = (monaco) => {
        if (monaco) {
            monaco.languages.register({id: 'slang'});
            let keywords = [
                'abstract', 'base', 'call', 'class', 'delete', 'do', 'else', 'elseif', 'end', 'field',
                'function', 'if', 'import', 'inherits', 'input', 'let', 'method', 'module', 'output',
                'override', 'private', 'procedure', 'public', 'repeat', 'return', 'start', 'then',
                'variable', 'while', 'false', 'nil', 'true', 'virtual', 'extern'
            ];
            let types = ['array', 'boolean', 'character', 'integer', 'real', 'float'];
            let paramTypes = ['in', 'out', 'var'];
            monaco.languages.setMonarchTokensProvider('slang', {
                keywords: keywords,
                types: types,
                paramTypes: paramTypes,
                tokenizer: {
                    root: [
                        [/@?[a-zA-Z][\w$]*/, {cases: {'@keywords': 'keyword', '@types': 'type', '@paramTypes': 'paramType', '@default': 'identifier'}}],
                        [/".*?"/, 'string'],
                        [/\/\//, 'comment']
                    ]
                }
            });

            monaco.editor.defineTheme('slangTheme', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    {token: 'comment', foreground: '#7F7F7F'},
                    {token: 'keyword', foreground: '#569CD6'},
                    {token: 'string', foreground: '#CE9178'},
                    {token: 'identifier', foreground: '#9CDCFE'},
                    {token: 'type', foreground: '#4EC9B0'},
                    {token: 'paramType', foreground: '#C586C0'}
                ],
                colors: {}
            });

            monaco.languages.registerCompletionItemProvider('slang', {
                provideCompletionItems: () => {
                    return {
                        suggestions: keywords.concat(types).concat(paramTypes).map((keyword) => {
                            return {
                                label: keyword,
                                kind: monaco.languages.CompletionItemKind.Keyword,
                                insertText: keyword
                            };
                        })
                    };
                }
            });
        }
    }

    return (
        <Box>
            <HStack spacing={4}>
                <Box w="50%">
                    <CompilerSettings example={example} onSelect={onSelect} />
                    <Editor
                        options={{
                            minimap: {
                                enabled: false,
                            },
                        }}
                        height="75vh"
                        theme="slangTheme"
                        language="slang"
                        beforeMount={addSlang}
                        defaultValue={CODE_SNIPPETS[example]}
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value)}
                    />
                </Box>
                <Output editorRef={editorRef} language={example} />
            </HStack>
        </Box>
    );
};
export default CodeEditor;