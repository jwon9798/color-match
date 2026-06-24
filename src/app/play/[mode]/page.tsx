import ColorMatcherGame from "@/components/ColorMatcherGame";
import GameShell from "@/components/GameShell";
import { GAME_MODES, isGameModeId } from "@/lib/gameModes";
import { notFound } from "next/navigation";

type PlayPageProps = {
  params: Promise<{ mode: string }>;
};

export default async function PlayPage({ params }: PlayPageProps) {
  const { mode } = await params;

  if (!isGameModeId(mode)) {
    notFound();
  }

  const config = GAME_MODES[mode];

  return (
    <GameShell>
      <ColorMatcherGame mode={config.id} />
    </GameShell>
  );
}

export function generateStaticParams() {
  return [{ mode: "single" }, { mode: "marathon-10" }, { mode: "marathon-20" }];
}
