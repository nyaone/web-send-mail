"use client";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";
import { Input } from "@mantine/core";
import classes from "./styles.module.css";
import "./line-number.css";
import type { KeyboardEventHandler } from "react";
import { useUncontrolled } from "@mantine/hooks";

const highlightWithLineNumbers = (input: string) =>
  highlight(input, languages.markup, "markup")
    .split("\n")
    .map((line, i) => `<span class='line-number'>${i + 1}</span>${line}`)
    .join("\n");

interface CodeHighlightEditorProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement> &
    KeyboardEventHandler<HTMLTextAreaElement>;
}
const CodeHighlightEditor = ({
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  onKeyDown,
}: CodeHighlightEditorProps) => {
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "<!-- 未指定 -->",
    onChange,
  });

  return (
    <Input.Wrapper label={label}>
      <Input
        component={Editor}
        value={_value}
        onValueChange={handleChange}
        highlight={(code: string) => highlightWithLineNumbers(code)}
        padding={10}
        className="editor"
        classNames={{
          wrapper: classes.wrapper,
          input: classes.input,
        }}
        multiline
        placeholder={placeholder}
        onKeyDown={onKeyDown}
      />
    </Input.Wrapper>
  );
};

export default CodeHighlightEditor;
