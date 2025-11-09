type ChronicleRecord = {
  id: string;
  week: string;
  text: string;
  createdAt: string;
};

const chronicles = new Map<string, ChronicleRecord>();

export function persistChronicle(record: ChronicleRecord) {
  chronicles.set(record.week, record);
}

export function readChronicle(week: string) {
  return chronicles.get(week) ?? null;
}
