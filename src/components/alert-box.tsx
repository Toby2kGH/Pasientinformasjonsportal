import { AlertUrgency } from '@prisma/client';
import { alertUrgencyLabel, alertUrgencyColor } from '@/lib/utils';
import { AlertTriangle, Phone, Clock, Info } from 'lucide-react';

interface AlertInstruction {
  urgency: AlertUrgency;
  instruction: string;
  action: string;
  sortOrder: number;
}

interface AlertBoxProps {
  alerts: AlertInstruction[];
}

const urgencyOrder: Record<AlertUrgency, number> = {
  EMERGENCY: 0,
  URGENT: 1,
  SOON: 2,
  ROUTINE: 3,
};

const urgencyIcon = (urgency: AlertUrgency) => {
  if (urgency === 'EMERGENCY') return <Phone className="shrink-0" size={18} />;
  if (urgency === 'URGENT') return <AlertTriangle className="shrink-0" size={18} />;
  if (urgency === 'SOON') return <Clock className="shrink-0" size={18} />;
  return <Info className="shrink-0" size={18} />;
};

export default function AlertBox({ alerts }: AlertBoxProps) {
  const sorted = [...alerts].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  );

  return (
    <div className="alert-box my-6 border-2 border-red-300 rounded-xl overflow-hidden">
      <div className="bg-red-600 text-white px-4 py-3 flex items-center gap-2">
        <AlertTriangle size={20} />
        <h3 className="font-serif font-semibold text-base">Når må du kontakte lege?</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {sorted.map((alert, i) => (
          <div
            key={i}
            className={`px-4 py-3 flex gap-3 items-start ${alertUrgencyColor(alert.urgency)}`}
          >
            {urgencyIcon(alert.urgency)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.instruction}</p>
              <p className="text-sm mt-0.5 flex items-center gap-1">
                <span className="font-semibold">{alertUrgencyLabel(alert.urgency)}:</span>
                <span>{alert.action}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
