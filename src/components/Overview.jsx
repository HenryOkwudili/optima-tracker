import { isFinished, STATUSES } from '../utils.js';

const summaries = [
  { label: 'Total tasks', key: 'total', color: 'bg-slate-400' },
  { label: 'In progress', key: 'doing', color: 'bg-blue-500' },
  { label: 'To do', key: 'todo', color: 'bg-slate-400' },
  { label: 'Completed', key: 'done', color: 'bg-lime-500' },
  { label: 'Overdue', key: 'overdue', color: 'bg-red-500' },
];

export default function Overview({ tasks, overdueCount }) {
  const values = {
    total: tasks.length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    done: tasks.filter((task) => isFinished(task.status)).length,
    overdue: overdueCount,
  };
  const done = values.total ? Math.round(values.done / values.total * 100) : 0;

  return (
    <section aria-label="Task progress" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {summaries.map(({ label, key, color }) => (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#242a33] dark:bg-[#14171c]" key={key}>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}<span className={`size-2 rounded-full ${color}`} />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{values[key]}</div>
          {key === 'done' && <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#242a33]"><div className="h-full rounded-full bg-[#86bc25]" style={{ width: `${done}%` }} /></div>}
        </div>
      ))}
      <div className="hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-[#242a33] dark:bg-[#14171c] xl:block">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status distribution</p>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#242a33]">
          {STATUSES.map((status) => {
            const count = tasks.filter((task) => task.status === status.value).length;
            return count ? <span className={`h-full ${status.value === 'doing' ? 'bg-blue-500' : status.value === 'done' ? 'bg-lime-500' : status.value === 'merged' ? 'bg-violet-500' : 'bg-slate-400'}`} key={status.value} style={{ width: `${count / Math.max(tasks.length, 1) * 100}%` }} /> : null;
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">{values.total ? `${done}% complete` : 'No tasks yet'}</p>
      </div>
    </section>
  );
}
