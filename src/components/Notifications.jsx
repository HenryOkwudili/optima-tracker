import Icon from './Icon.jsx';
import { formatDate, isOverdue, taskNumber } from '../utils.js';

export default function Notifications({ tasks, canWrite, onPatch, onOpen, onClose }) {
  const overdue = tasks.filter((task) => isOverdue(task)).sort((a, b) => `${a.day} ${a.due}`.localeCompare(`${b.day} ${b.due}`));
  return (
    <div className="absolute right-0 top-12 z-30 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#343b47] dark:bg-[#14171c]" role="region" aria-label="Overdue notifications">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-[#242a33]">
        <div><h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Overdue tasks</h2><p className="text-xs text-slate-400">{overdue.length} need attention</p></div>
        <button aria-label="Close notifications" className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-[#242a33]" onClick={onClose} type="button"><Icon className="size-4" name="close" /></button>
      </div>
      <div className="max-h-[55vh] overflow-y-auto p-2">
        {overdue.map((task) => (
          <div className="rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-[#181c22]" key={task.id}>
            <button className="block w-full text-left" onClick={() => onOpen(task)} type="button">
              <span className="font-mono text-[10px] text-slate-400">{taskNumber(task)}</span>
              <span className="ml-2 text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</span>
              <span className="mt-1 block text-xs text-red-600 dark:text-red-400">Due {task.due} · {formatDate(task.day)} · {task.owner || 'Unassigned'}</span>
              {task.escalatedAt && <span className="mt-1 block text-[11px] text-slate-400">Escalated to {task.escalatedTo || task.watcher}</span>}
            </button>
            <div className="mt-2 flex gap-2">
              {canWrite && <button className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 dark:border-[#343b47] dark:text-slate-300" onClick={() => onPatch(task, task.escalatedAt ? { escalatedAt: null, escalatedTo: null } : { escalatedAt: Date.now(), escalatedTo: task.watcher || '' })} type="button">{task.escalatedAt ? 'Undo escalation' : 'Mark escalated'}</button>}
              <button className="rounded-md px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 dark:hover:bg-[#242a33]" onClick={() => onOpen(task)} type="button">View task</button>
            </div>
          </div>
        ))}
        {!overdue.length && <div className="px-4 py-8 text-center"><Icon className="mx-auto size-5 text-lime-600" name="check" /><p className="mt-2 text-sm text-slate-500">You’re all caught up.</p></div>}
      </div>
    </div>
  );
}
