import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import CompilerSettings from "./CompilerSettings";
import LZString from "lz-string";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState("");
    const [example, setExample] = useState("Hello, World!");
    const queryParameters = new URLSearchParams(window.location.search)
    const sourceParam = queryParameters.get('source')

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
        if (sourceParam) {
            const string = LZString.decompressFromEncodedURIComponent(sourceParam);
            setValue(string)
        }
        else {
            setValue(CODE_SNIPPETS[example])
        }
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
                'variable', 'while', 'virtual', 'extern', 'true', 'false', 'nil'
            ];
            let types = ['array', 'boolean', 'character', 'integer', 'real', 'float'];
            let paramTypes = ['in', 'out', 'var'];
            monaco.languages.setMonarchTokensProvider('slang', {
                keywords: keywords,
                types: types,
                paramTypes: paramTypes,
                brackets: [
                    { token: 'delimiter.curly', open: '{', close: '}' },
                    { token: 'delimiter.parenthesis', open: '(', close: ')' },
                    { token: 'delimiter.square', open: '[', close: ']' },
                    { token: 'delimiter.angle', open: '<', close: '>' }
                ],
                autoClosingPairs: [
                    { open: '[', close: ']' },
                    { open: '{', close: '}' },
                    { open: '(', close: ')' },
                    { open: "'", close: "'", notIn: ['string', 'comment'] },
                    { open: '"', close: '"', notIn: ['string'] }
                ],
                surroundingPairs: [
                    { open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
                    { open: '"', close: '"' },
                ],
                escapes: /\\(?:[0abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
                tokenizer: {
                    root: [
                        [/@?[a-zA-Z][\w$]*/, {cases: {'@keywords': 'keyword', '@types': 'type', '@paramTypes': 'paramType', '@default': 'identifier'}}],
                        /*[/".*?"/, 'string'],*/
                        [/\/\//, 'comment'],
                        [/\b\d*\.?\d+f?\b/, 'number'],
                        [/({)([^}]+)(})/, ['string', 'ignore', 'string']],
                        [/[{}()\[\]]/, '@brackets'],

                        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
                        [/"/, 'string', '@string'],
                        [/f"/, { token: 'string', next: '@interpolatedstring' }],
                        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                        [/'/, 'string.invalid']
                    ],
                    string: [
                        [/[^\\"]+/, 'string'],
                        [/@escapes/, 'string.escape'],
                        [/\\./, 'string.escape.invalid'],
                        [/"/, 'string', '@pop']
                    ],
                    interpolatedstring: [
                        [/[^\\"{]+/, 'string'],
                        [/@escapes/, 'string.escape'],
                        [/\\./, 'string.escape.invalid'],
                        [/{{/, 'string.escape'],
                        [/}}/, 'string.escape'],
                        [/{/, { token: 'string', next: 'root.interpolatedstring' }],
                        [/"/, { token: 'string', next: '@pop' }]
                    ],
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
                    {token: 'paramType', foreground: '#C586C0'},
                    {token: 'number', foreground: '#B5CEA8'},
                    {token: 'string.escape', foreground: '#d7ba7d'}
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
                    <CompilerSettings example={example} onSelect={onSelect} value={value} />
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