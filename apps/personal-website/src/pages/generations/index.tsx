import GenerationsHero from '@/components/generations/HeroExplainerGenerations';
import EntryInput from '@/components/generations/PromptInputGenerations';
import ReflectionGallery from '@/components/generations/ReflectionGalleryToneDetection';
import PublishChronicleButton from '@/components/generations/PublishChronicleButton';

export default function GenerationsPage() {
  // Auto-detect current ISO week so you don’t type promptId manually
  const getWeekKey = () => {
    const d = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const week = 1 + Math.round(
      ((+date - +firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7
    );
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  };

  const weekId = getWeekKey();

  return (
    <>
      <GenerationsHero />
      <EntryInput />
      <ReflectionGallery />
      {/* 👇  Add this new section at the bottom */}
      <PublishChronicleButton promptId={weekId} />
    </>
  );
}
