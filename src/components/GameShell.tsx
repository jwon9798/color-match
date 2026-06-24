import AdSlot from "@/components/AdSlot";

type GameShellProps = {
  children: React.ReactNode;
};

export default function GameShell({ children }: GameShellProps) {
  return (
    <div className="flex min-h-full w-full flex-1 flex-col items-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-2 pb-6 sm:px-4 sm:pb-8">
      <div className="flex w-full max-w-lg items-start justify-center gap-4 lg:max-w-5xl lg:gap-6">
        <div className="sticky top-4 hidden shrink-0 self-start lg:block lg:w-36 xl:w-44">
          <AdSlot
            slotId="side-left"
            variant="inline"
            className="min-h-[480px] xl:min-h-[560px]"
          />
        </div>

        <div className="min-w-0 flex-1">{children}</div>

        <div className="sticky top-4 hidden shrink-0 self-start lg:block lg:w-36 xl:w-44">
          <AdSlot
            slotId="side-right"
            variant="inline"
            className="min-h-[480px] xl:min-h-[560px]"
          />
        </div>
      </div>
    </div>
  );
}
