interface PageTitleProps {
  readonly title: string;
  readonly src?: string;
}

export function PageTitle({ title, src }: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[var(--theme-text-primary)]">
        {title}
      </h1>
      {src && (
        <p className="mt-2 text-sm text-[var(--theme-text-secondary)]">
          Source:{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
            {src}
          </code>
        </p>
      )}
    </div>
  );
}
