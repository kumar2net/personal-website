import GenerationsHero from "@/components/generations/HeroExplainerGenerations";
import EntryInput from "@/components/generations/PromptInputGenerations";
import ReflectionGallery from "@/components/generations/ReflectionGalleryToneDetection";

export default function GenerationsPage() {
  return (
    <div className="bg-slate-950">
      <GenerationsHero />
      <EntryInput />
      <ReflectionGallery />
    </div>
  );
}
