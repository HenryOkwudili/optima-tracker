import { useState } from 'react';
import { STATUSES, initials, taskNumber } from '../utils.js';

const columnStyles = {
  todo: 'border-slate-200 bg-white/60 dark:border-[#242a33] dark:bg-[#14171c]',
  doing: 'border-blue-200 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20',
  done: 'border-lime-200 bg-lime-50/70 dark:border-lime-900/50 dark:bg-lime-950/20',
  merged: 'border-violet-200 bg-violet-50/70 dark:border-violet-900/50 dark:bg-violet-950/20',
  closed: 'border-teal-200 bg-teal-50/70 dark:border-teal-900/50 dark:bg-teal-950/20',
};
const pillStyles = {
  todo: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  doing: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  done: 'bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300',
  merged: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  closed: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
};
const dotStyles = { todo: 'bg-slate-400', doing: 'bg-blue-500', done: 'bg-lime-600', merged: 'bg-violet-500', closed: 'bg-teal-600' };
const dropStyles = {
  todo: 'border-slate-300', doing: 'border-blue-300 dark:border-blue-800', done: 'border-lime-300 dark:border-lime-800',
  merged: 'border-violet-300 dark:border-violet-800', closed: 'border-teal-300 dark:border-teal-800',
};
const priorityLabel = { high: 'High', med: 'Medium', low: 'Low' };

export default function KanbanBoard({ tasks, subtasks, canWrite, onOpen, onStatus, onCreate }) {
  const [dragging, setDragging] = useState(null);
  const [target, setTarget] = useState(null);
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {STATUSES.map(({ value, label }) => {
        const cards = tasks.filter((task) => task.status === value);
        return (
          <section
            aria-label={`${label} tasks`}
            className={`flex min-h-80 w-[356px] shrink-0 flex-col rounded-xl border p-4 ${columnStyles[value]} ${target === value ? 'ring-2 ring-[#86bc25]' : ''}`}
            key={value}
            onDragOver={(event) => { if (canWrite) { event.preventDefault(); setTarget(value); } }}
            onDragLeave={() => setTarget(null)}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging) onStatus(dragging, value);
              setDragging(null);
              setTarget(null);
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${pillStyles[value]}`}><span className={`size-2 rounded-full ${dotStyles[value]}`} />{label}</span>
              <span className="font-mono text-sm text-slate-400">{cards.length}</span>
            </div>
            {canWrite && <button className="mt-4 w-fit text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" onClick={() => onCreate(value)} type="button">+ Add Task</button>}
            <div className="mt-4 grid flex-1 content-start gap-3">
              {cards.map((task) => {
                const children = subtasks.filter((subtask) => subtask.parent === task.id);
                const doneChildren = children.filter((child) => child.done).length;
                return (
                  <article
                    className={`cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 dark:border-[#2b313b] dark:bg-[#181c22] dark:hover:border-[#414957] ${dragging === task.id ? 'opacity-40' : ''}`}
                    draggable={canWrite}
                    key={task.id}
                    onClick={() => onOpen(task)}
                    onDragEnd={() => { setDragging(null); setTarget(null); }}
                    onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); setDragging(task.id); }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{taskNumber(task)}</span>
                      <span className={`ml-auto text-xs font-medium ${task.priority === 'high' ? 'text-red-500' : task.priority === 'med' ? 'text-amber-600' : 'text-slate-400'}`}>{priorityLabel[task.priority] || task.priority}</span>
                    </div>
                    <p className="mt-2 text-[17px] font-medium leading-snug text-slate-900 dark:text-slate-100">{task.title}</p>
                    {task.note && <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.note}</p>}
                    {task.ws && <span className="mt-3 inline-block rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-[#343b47] dark:text-slate-300">{task.ws}</span>}
                    {children.length > 0 && <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400"><span className="h-1 flex-1 overflow-hidden rounded bg-slate-100 dark:bg-[#2b313b]"><span className="block h-full rounded bg-[#86bc25]" style={{ width: `${doneChildren / children.length * 100}%` }} /></span>{doneChildren}/{children.length}</div>}
                    <div className="mt-3 flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lime-700 text-[10px] font-semibold text-white">{task.owner ? initials(task.owner) : '?'}</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-slate-500 dark:text-slate-400">{task.owner || 'Unassigned'}</span>
                      {canWrite && <select aria-label={`Status for ${task.title}`} className="rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm dark:border-[#343b47] dark:text-slate-200" onChange={(event) => onStatus(task, event.target.value)} value={task.status}>{STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select>}
                    </div>
                  </article>
                );
              })}
              {!cards.length && <div className={`grid h-20 place-items-center rounded-lg border border-dashed text-sm text-slate-400 ${dropStyles[value]}`}>Drop a task here</div>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
