import { ControlTowerNav } from "../components/control-tower/ControlTowerNav";

export default function ControlTowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control Tower</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Executive views aligned with the Lovable reference app (nested routes under{" "}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">/control-tower</code>).
        </p>
      </div>
      <ControlTowerNav />
      {children}
    </div>
  );
}
