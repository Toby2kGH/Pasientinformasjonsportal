import Link from 'next/link';
import { Activity, Sun, Wind, Heart, Flower2, Droplets, ScanFace, Droplet, Brain, Bone, Baby } from 'lucide-react';

interface TumorGroupCardProps {
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  regimenCount?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity size={28} />,
  sun: <Sun size={28} />,
  wind: <Wind size={28} />,
  heart: <Heart size={28} />,
  flower2: <Flower2 size={28} />,
  droplets: <Droplets size={28} />,
  'scan-face': <ScanFace size={28} />,
  droplet: <Droplet size={28} />,
  brain: <Brain size={28} />,
  bone: <Bone size={28} />,
  baby: <Baby size={28} />,
};

export default function TumorGroupCard({ name, slug, description, iconName, regimenCount }: TumorGroupCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-medical-blue hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="text-medical-blue bg-blue-50 rounded-lg p-2.5 group-hover:bg-medical-blue group-hover:text-white transition-colors">
          {iconName && iconMap[iconName] ? iconMap[iconName] : <Activity size={28} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-gray-900 group-hover:text-medical-blue transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          )}
          {regimenCount !== undefined && (
            <p className={`text-xs mt-2 font-medium ${regimenCount > 0 ? 'text-medical-blue' : 'text-gray-400'}`}>
              {regimenCount > 0 ? `${regimenCount} kurer` : 'Ingen kurer i demoen ennå'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
