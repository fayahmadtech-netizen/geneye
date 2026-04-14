interface ModulePlaceholderProps {
  title: string;
  description?: string;
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      ) : null}
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
        This area is wired in the navigation. Full module experience coming soon.
      </p>
    </div>
  );
}
