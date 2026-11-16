import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders dictionary copy that uses the lightweight markup:
 *   "\n" → line break (each line is its own block)
 *   "*word*" → editorial serif emphasis
 */
export function Rich({ text, lineClassName, inline = false }: { text: string; lineClassName?: string; inline?: boolean }) {
  const lines = text.split("\n");
  if (inline) return <>{lines.map((line, i) => <Fragment key={i}>{i > 0 && " "}{emphasis(line)}</Fragment>)}</>;
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={cn("block", lineClassName)}>
          {emphasis(line)}
        </span>
      ))}
    </>
  );
}

function emphasis(line: string) {
  return line.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className="rich-em">
        {part.slice(1, -1)}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Plain-text version (for aria-labels, metadata…). */
export const plain = (text: string) => text.replace(/\*/g, "").replace(/\n/g, " ");
