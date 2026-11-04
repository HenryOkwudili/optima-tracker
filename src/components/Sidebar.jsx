import Icon from './Icon.jsx';
import { initials, WORKSTREAMS } from '../utils.js';

function FilterButton({ active, count, label, onClick, color = 'bg-slate-400', round = false }) {
  return (
    <button
      aria-pressed={active}
      className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition ${active ? 'bg-[#202730] text-white' : 'text-slate-300 hover:bg-[#161a20]'}`}
      onClick={onClick}
      type="button"
    >
      <span className={`grid size-6 shrink-0 place-items-center text-[10px] font-semibold text-white ${round ? 'rounded-full' : 'rounded-md'} ${color}`}>{label === 'All workstreams' ? '⌘' : round ? initials(label) : label.slice(0, 2).toUpperCase()}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="font-mono text-[11px] text-slate-500">{count}</span>
    </button>
  );
}

const colors = ['bg-lime-500', 'bg-sky-500', 'bg-amber-500', 'bg-violet-500', 'bg-teal-500', 'bg-pink-500', 'bg-slate-500'];

export default function Sidebar({ tasks, workstream, owner, onWorkstream, onOwner, theme, onTheme }) {
  const owners = [...new Set(tasks.map((task) => task.owner).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const countsFor = (property, value) => tasks.filter((task) => property === 'all' || task[property] === value).length;

  return (
    <aside className="flex h-full flex-col border-r border-[#1b2027] bg-[#0b0d10] text-slate-100">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#1b2027] px-5">
        <span className="relative grid size-8 place-items-center rounded-lg bg-[#86bc25] text-sm font-bold text-black after:absolute after:size-2 after:rounded-full after:bg-black"> </span>
        <span className="font-semibold tracking-tight">Optima Close-out</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Workstreams</p>
        <FilterButton active={workstream === 'all'} count={countsFor('all')} label="All workstreams" onClick={() => onWorkstream('all')} />
        {WORKSTREAMS.map((item, index) => (
          <FilterButton
            active={workstream === item}
            color={colors[index]}
            count={countsFor('ws', item)}
            key={item}
            label={item}
            onClick={() => onWorkstream(workstream === item ? 'all' : item)}
          />
        ))}
        <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Team</p>
        <FilterButton active={owner === 'all'} count={tasks.length} label="Everyone" onClick={() => onOwner('all')} round />
        {owners.map((person) => (
          <FilterButton
            active={owner === person}
            count={countsFor('owner', person)}
            key={person}
            label={person}
            onClick={() => onOwner(owner === person ? 'all' : person)}
            round
          />
        ))}
        {tasks.some((task) => !task.owner) && (
          <FilterButton active={owner === '__none'} count={tasks.filter((task) => !task.owner).length} label="Unassigned" onClick={() => onOwner(owner === '__none' ? 'all' : '__none')} round />
        )}
      </div>
      <div className="border-t border-[#1b2027] p-3">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#14181d] p-1">
          <button aria-pressed={theme === 'light'} className={`flex h-8 items-center justify-center gap-2 rounded-md text-xs ${theme === 'light' ? 'bg-[#2a313b] text-white' : 'text-slate-400'}`} onClick={() => onTheme('light')} type="button"><Icon className="size-3.5" name="sun" />Light</button>
          <button aria-pressed={theme === 'dark'} className={`flex h-8 items-center justify-center gap-2 rounded-md text-xs ${theme === 'dark' ? 'bg-[#2a313b] text-white' : 'text-slate-400'}`} onClick={() => onTheme('dark')} type="button"><Icon className="size-3.5" name="moon" />Dark</button>
        </div>
        <p className="px-2 pt-3 text-[11px] leading-relaxed text-amber-300/80">Shared access: anyone with the link can edit.</p>
      </div>
    </aside>
  );
}
