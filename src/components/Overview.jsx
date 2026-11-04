import { isFinished, STATUSES } from '../utils.js';

const dots = {
  doing: 'bg-blue-500',
  done: 'bg-lime-600',
  merged: 'bg-violet-500',
  closed: 'bg-teal-600',
  todo: 'bg-slate-400',
};
// Order shown in the summary strip.
const order = ['doing', 'done', 'merged', 'closed', 'todo'];

export default function Overview({ tasks }) {
  const total = tasks.length;
  const finished = tasks.filter((task) => isFinished(task.status)).length;
  const percent = total ? Math.round(finished / total * 100) : 0;

  return (
    <section aria-label="Task progress" className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#242a33] dark:bg-[#14171c]">
      <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-[#242a33] md:grid-cols-6">
        <div className="col-span-2 px-6 py-5 md:col-span-1">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</div>
          <div className="mt-1 flex items-baseline gap-2"><span className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{finished} / {total}</span><span className="text-sm text-slate-400">{percent}%</span></div>
        </div>
        {order.map((value) => {
          const status = STATUSES.find((item) => item.value === value);
          return (
            <div className="px-6 py-5" key={value}>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><span className={`size-2 rounded-full ${dots[value]}`} />{status.label}</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{tasks.filter((task) => task.status === value).length}</div>
            </div>
          );
        })}
      </div>
      <div aria-label={`${percent}% complete`} className="h-1.5 bg-slate-200 dark:bg-[#242a33]" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={percent}>
        <div className="h-full bg-[#86bc25] transition-all" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
