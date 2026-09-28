// Unlike the layout, a template remounts on every navigation, so each tab's
// panels fade in under the header instead of cutting in.
export default function WorkspaceTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col animate-in fade-in duration-200 ease-out motion-reduce:animate-none">
      {children}
    </div>
  );
}
