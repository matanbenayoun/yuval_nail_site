import type { ScheduleBlock } from "@/lib/types"

const g = global as typeof global & { _scheduleBlocks?: ScheduleBlock[] }
if (!g._scheduleBlocks) g._scheduleBlocks = []

export function getAll(): ScheduleBlock[] {
  return g._scheduleBlocks!
}

export function create(data: Pick<ScheduleBlock, "date" | "time" | "reason">): ScheduleBlock {
  const block: ScheduleBlock = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  g._scheduleBlocks!.push(block)
  return block
}

export function remove(id: string): boolean {
  const before = g._scheduleBlocks!.length
  g._scheduleBlocks = g._scheduleBlocks!.filter((b) => b.id !== id)
  return g._scheduleBlocks.length < before
}

export function isDateBlocked(date: string): boolean {
  return g._scheduleBlocks!.some((b) => b.date === date && !b.time)
}

export function isTimeBlocked(date: string, time: string): boolean {
  return g._scheduleBlocks!.some((b) => b.date === date && (b.time === time || !b.time))
}
