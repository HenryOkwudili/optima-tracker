import { useState } from 'react';
import Icon from './Icon.jsx';
import { STATUSES, taskNumber } from '../utils.js';
import { StatusBadge } from './TaskTable.jsx';

export default function KanbanBoard({ tasks, subtasks, canWrite, onOpen, onStatus, onCreate }) {
  const [dragging, setDragging] = useState(null);
  const [target, setTarget] = useState(null);
  return (
    <div className="grid gap-4 overflow-x-auto pb-2 md:grid-cols-2 2xl:grid-cols-5">
      {STATUSES.map(({ value, label }) => {
        const cards = tasks.filter((task) => task.status === value);
        return (
          <section
            aria-label={`${label} tasks`}
            className={`flex min-h-64 min-w-[250px] flex-col rounded-xl bg-slate-100/70 p-2 dark:bg-[#14171c] ${target === value ? 'ring-2 ring-[#86bc25]' : ''}`}
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
            <div className="flex items-center gap-2 px-2 py-2">
              <StatusBadge status={value} /><span className="font-mono text-xs text-slate-400">{cards.length}</span>
              {canWrite && <button aria-label={`Add task to ${label}`} className="ml-auto grid size-7 place-items-center rounded-md text-slate-400 hover:bg-white hover:text-slate-900 dark:hover:bg-[#242a33] dark:hover:text-white" onClick={() => onCreate(value)} type="button"><Icon className="size-4" name="add" /></button>}
            </div>
            <div className="grid flex-1 content-start gap-2 p-1">
              {cards.map((task) => {
                const children = subtasks.filter((subtask) => subtask.parent === task.id);
                return (
                  <article
                    className={`cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 dark:border-[#2b313b] dark:bg-[#181c22] dark:hover:border-[#414957] ${dragging === task.id ? 'opacity-40' : ''}`}
                    draggable={canWrite}
                    key={task.id}
                    onClick={() => onOpen(task)}
                    onDragEnd={() => { setDragging(null); setTarget(null); }}
                    onDragStart={(event) => { event.dataTransfer.setData('text/plain', task.id); setDragging(task.id); }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{taskNumber(task)}</span>
                      <span className={`ml-auto text-[10px] font-semibold uppercase ${task.priority === 'high' ? 'text-red-500' : task.priority === 'med' ? 'text-amber-600' : 'text-slate-400'}`}>{task.priority}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium leading-snug text-slate-900 dark:text-slate-100">{task.title}</p>
                    {task.note && <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.note}</p>}
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="truncate">{task.owner || 'Unassigned'}</span><span className="shrink-0">{task.ws}</span>
                    </div>
                    {children.length > 0 && <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400"><span className="h-1 flex-1 overflow-hidden rounded bg-slate-100 dark:bg-[#2b313b]"><span className="block h-full rounded bg-[#86bc25]" style={{ width: `${children.filter((child) => child.done).length / children.length * 100}%` }} /></span>{children.filter((child) => child.done).length}/{children.length}</div>}
                  </article>
                );
              })}
              {!cards.length && <p className="py-8 text-center text-xs text-slate-400">No tasks</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
