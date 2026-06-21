type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold text-main">{title}</h2>
      {description && <p className="text-sm text-muted">{description}</p>}
    </div>
  );
}
