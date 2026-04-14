const ORG_FIELDS: { label: string; value: string }[] = [
  { label: "Operating model", value: "Federated Center of Excellence (CoE)" },
  { label: "Decision authority", value: "Centralized Governance / Decentralized Execution" },
  { label: "Reporting line", value: "Chief AI Officer → CTO → Board AI Committee" },
  { label: "Primary mandate", value: "Scale AI capabilities across all Business Units" },
  { label: "Engagement model", value: "BU Embedded + CoE Advisory" },
  { label: "Review cadence", value: "Monthly BU sync · Quarterly Board review" },
];

const BU_UNITS = ["Finance & Risk", "Insurance Ops", "Revenue Mgmt", "Supply Chain"];

const blueBtn =
  "rounded-lg bg-[#2980B9] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm sm:text-sm";
const purpleBtn =
  "rounded-lg bg-[#8E44AD] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm sm:text-sm";
const line = "bg-gray-400 dark:bg-gray-600";

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="mt-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950/50 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}

export function OrgDesignSection() {
  return (
    <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Org Design Template &amp; Operating Model
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Structural design, reporting lines, and operating principles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-8 md:gap-y-4">
        {ORG_FIELDS.map((f) => (
          <FieldBox key={f.label} label={f.label} value={f.value} />
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Operating model diagram
        </h3>
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-950/30">
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <div className={blueBtn}>Board AI Committee</div>
            <div className={`h-5 w-px ${line}`} aria-hidden />
            <div className={blueBtn}>Chief AI Officer (CAIO)</div>
            <div className={`h-5 w-px shrink-0 ${line}`} aria-hidden />
            {/* Fork: crossbar 25%–75% + drops to each branch */}
            <div className="relative w-full max-w-lg">
              <div
                className={`pointer-events-none absolute left-[25%] right-[25%] top-0 h-px ${line}`}
                aria-hidden
              />
              <div
                className={`pointer-events-none absolute left-[25%] top-0 h-4 w-px -translate-x-1/2 ${line}`}
                aria-hidden
              />
              <div
                className={`pointer-events-none absolute left-[75%] top-0 h-4 w-px -translate-x-1/2 ${line}`}
                aria-hidden
              />
              <div className="flex justify-between gap-3 pt-4 sm:gap-6">
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <div className={`w-full max-w-[220px] ${blueBtn}`}>AI Center of Excellence</div>
                  <div className={`mt-3 h-4 w-px ${line}`} aria-hidden />
                  <div className="flex w-full flex-wrap justify-center gap-2">
                    {BU_UNITS.map((bu) => (
                      <div
                        key={bu}
                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-center text-[10px] font-medium leading-tight text-gray-800 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 sm:text-xs"
                      >
                        {bu}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center">
                  <div className={`w-full max-w-[200px] ${purpleBtn}`}>Everyday AI</div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] italic text-gray-500 dark:text-gray-400">
            BU-Embedded AI Leads report to CAIO (dotted line to BU Head)
          </p>
        </div>
      </div>
    </section>
  );
}
