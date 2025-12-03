/**
 * @module @convergence/ui/components/animate-ui/components/animate/code
 * @file Code component system for displaying syntax-highlighted code. Provides
 *   a compound component architecture with Code (container), CodeHeader, and
 *   CodeBlock sub-components for flexible code display with optional features
 *   like copy buttons and typewriter animations.
 */

"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import {
  CodeBlock as CodeBlockPrimitive,
  type CodeBlockProps as CodeBlockPropsPrimitive,
} from "@/components/animate-ui/primitives/animate/code-block";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { getStrictContext } from "@/lib/get-strict-context";

/**
 * Context type for sharing code content between compound components.
 *
 * @internal
 */
type CodeContextType = {
  code: string;
};

const [CodeProvider, useCode] =
  getStrictContext<CodeContextType>("CodeContext");

/** Props for the Code container component. */
type CodeProps = React.ComponentProps<"div"> & {
  /** The source code string to display */
  code: string;
};

/**
 * Root container component for the Code compound component system.
 *
 * Provides context for child components and renders a styled container. Must
 * wrap CodeHeader and CodeBlock components to share the code content.
 *
 * @example
 *   ```tsx
 *   <Code code={sourceCode}>
 *     <CodeHeader copyButton>example.ts</CodeHeader>
 *     <CodeBlock lang="typescript" />
 *   </Code>
 *   ```;
 *
 * @param props - Code component props
 * @param props.className - Additional CSS classes to merge
 * @param props.code - The source code string to share with child components
 * @param props.children - Child components (typically CodeHeader and CodeBlock)
 * @param props... - All other div HTML attributes
 * @returns Code container component
 * @see {@link CodeHeader}
 * @see {@link CodeBlock}
 */
function Code({ className, code, ...props }: CodeProps) {
  return (
    <CodeProvider value={{ code }}>
      <div
        data-slot="code"
        className={cn(
          "relative flex flex-col overflow-hidden border bg-accent/50 rounded-lg",
          className
        )}
        {...props}
      />
    </CodeProvider>
  );
}

/** Props for the CodeHeader component. */
type CodeHeaderProps = React.ComponentProps<"div"> & {
  /** Icon component to display before the header content */
  icon?: React.ElementType;
  /** Whether to show a copy button (default: false) */
  copyButton?: boolean;
};

/**
 * Header section for the Code component.
 *
 * Displays a header bar with optional icon, custom content, and a
 * copy-to-clipboard button. Accesses the code from parent Code context to
 * enable copying.
 *
 * @example
 *   ```tsx
 *   // With filename and copy button
 *   <CodeHeader copyButton>config.ts</CodeHeader>
 *
 *   // With icon
 *   <CodeHeader icon={FileIcon} copyButton>
 *     package.json
 *   </CodeHeader>
 *   ```;
 *
 * @param props - CodeHeader component props
 * @param props.className - Additional CSS classes to merge
 * @param props.children - Header content (typically filename or description)
 * @param props.icon - Icon component to display before content
 * @param props.copyButton - Show copy button on the right (default: false)
 * @param props... - All other div HTML attributes
 * @returns Code header component
 * @see {@link Code}
 * @see {@link CopyButton}
 */
function CodeHeader({
  className,
  children,
  icon: Icon,
  copyButton = false,
  ...props
}: CodeHeaderProps) {
  const { code } = useCode();

  return (
    <div
      data-slot="code-header"
      className={cn(
        "bg-accent shrink-0 gap-x-2 border-b border-border/75 dark:border-border/50 text-sm flex text-muted-foreground items-center px-4 w-full h-10",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      {children}
      {copyButton && (
        <CopyButton
          content={code}
          size="xs"
          variant="ghost"
          className="ml-auto w-auto h-auto p-2 -mr-2"
        />
      )}
    </div>
  );
}

/**
 * Props for the CodeBlock sub-component. Inherits from CodeBlockPrimitive but
 * code is provided via context.
 */
type CodeBlockProps = Omit<CodeBlockPropsPrimitive, "code"> & {
  /** Show a blinking cursor during typewriter animation */
  cursor?: boolean;
};

/**
 * Code display section with syntax highlighting.
 *
 * Renders the actual code content with syntax highlighting using Shiki.
 * Automatically uses the theme from next-themes and receives code from parent
 * Code context. Supports typewriter animation and cursor display.
 *
 * @example
 *   ```tsx
 *   // Static display
 *   <CodeBlock lang="typescript" />
 *
 *   // With typewriter animation
 *   <CodeBlock
 *     lang="python"
 *     writing
 *     duration={3000}
 *     cursor
 *   />
 *   ```;
 *
 * @param props - CodeBlock component props
 * @param props.cursor - Show blinking cursor during writing animation
 * @param props.className - Additional CSS classes to merge
 * @param props.lang - Programming language for syntax highlighting
 * @param props.writing - Enable typewriter animation
 * @param props.duration - Animation duration in milliseconds
 * @param props.delay - Delay before animation starts
 * @param props.onDone - Callback when animation completes
 * @param props.onWrite - Progress callback during animation
 * @param props... - All other CodeBlockPrimitive props
 * @returns Code block component with syntax highlighting
 * @see {@link Code}
 * @see {@link CodeBlockPrimitive}
 */
function CodeBlock({ cursor, className, ...props }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const { code } = useCode();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <CodeBlockPrimitive
      ref={scrollRef}
      data-slot="code-block"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      scrollContainerRef={scrollRef}
      className={cn(
        "relative text-sm p-4 overflow-auto",
        "[&>pre,_&_code]:!bg-transparent [&>pre,_&_code]:[background:transparent_!important] [&>pre,_&_code]:border-none [&_code]:!text-[13px] [&_code_.line]:!px-0",
        cursor &&
          "data-[done=false]:[&_.line:last-of-type::after]:content-['|'] data-[done=false]:[&_.line:last-of-type::after]:inline-block data-[done=false]:[&_.line:last-of-type::after]:w-[1ch] data-[done=false]:[&_.line:last-of-type::after]:-translate-px",
        className
      )}
      code={code}
      {...props}
    />
  );
}

export {
  Code,
  CodeHeader,
  CodeBlock,
  useCode,
  type CodeProps,
  type CodeHeaderProps,
  type CodeBlockProps,
};
