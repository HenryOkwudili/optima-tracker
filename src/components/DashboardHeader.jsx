import Icon from './Icon.jsx';
import { formatDate, shiftDate } from '../utils.js';

export default function DashboardHeader({
  day, allDays, onDayChange, onAllDays, search, onSearch, status, onStatus,
  view, onView, onCreate, onExport, canWrite, overdue, onNotifications, showNotifications, onMenu,
  onToday,
}) {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-[#f4f5f7]/95 px-5 py-3 backdrop-blur dark:border-[#242a33] dark:bg-[#0c0e11]/95 lg:px-8">
      <button aria-label="Open navigation" className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-300 lg:hidden" onClick={onMenu} type="button"><Icon name="menu" /></button>
      <div className="mr-auto flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="hidden sm:inline">Zenith Optima</span><span className="hidden sm:inline">/</span>
        <span className="truncate font-semibold text-slate-900 dark:text-slate-100">Daily checklist</span>
      </div>
      <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white dark:border-[#343b47] dark:bg-[#14171c]">
        <button aria-label="Previous day" className="grid size-8 place-items-center text-slate-500 hover:text-slate-950 dark:hover:text-white" onClick={() => onDayChange(shiftDate(day, -1))} type="button"><Icon name="chevronLeft" /></button>
        <span className="min-w-[96px] text-center text-xs font-medium text-slate-700 dark:text-slate-200">{allDays ? 'All dates' : formatDate(day)}</span>
        <button aria-label="Next day" className="grid size-8 place-items-center text-slate-500 hover:text-slate-950 dark:hover:text-white" onClick={() => onDayChange(shiftDate(day, 1))} type="button"><Icon name="chevronRight" /></button>
      </div>
      <button className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-200 dark:hover:bg-[#1b2028]" onClick={onToday} type="button">Today</button>
      <button aria-pressed={allDays} className={`h-9 rounded-lg border px-3 text-xs font-medium ${allDays ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950' : 'border-slate-200 bg-white text-slate-700 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-200'}`} onClick={onAllDays} type="button">All days</button>
      <button className="relative grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-300 dark:hover:bg-[#1b2028]" onClick={onNotifications} type="button" aria-expanded={showNotifications} aria-label={`${overdue.length} overdue tasks`}>
        <Icon name="calendar" />
        {overdue.length > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] leading-4 text-white">{overdue.length}</span>}
      </button>
      <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-200 dark:hover:bg-[#1b2028]" onClick={onExport} type="button"><Icon className="size-3.5" name="download" /><span className="hidden sm:inline">Export</span></button>
      <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#86bc25] px-3 text-xs font-semibold text-slate-950 hover:bg-[#97cf2e] disabled:cursor-not-allowed disabled:opacity-50" disabled={!canWrite} onClick={onCreate} type="button"><Icon className="size-4" name="add" /><span>Task</span></button>
      <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-[#343b47] dark:bg-[#14171c]">
        <button aria-label="List view" aria-pressed={view === 'list'} className={`grid size-7 place-items-center rounded-md ${view === 'list' ? 'bg-slate-100 text-slate-950 dark:bg-[#2a313b] dark:text-white' : 'text-slate-400'}`} onClick={() => onView('list')} type="button"><Icon className="size-4" name="list" /></button>
        <button aria-label="Board view" aria-pressed={view === 'board'} className={`grid size-7 place-items-center rounded-md ${view === 'board' ? 'bg-slate-100 text-slate-950 dark:bg-[#2a313b] dark:text-white' : 'text-slate-400'}`} onClick={() => onView('board')} type="button"><Icon className="size-4" name="board" /></button>
      </div>
      <div className="order-last flex w-full items-center gap-2 border-t border-slate-200 pt-2 dark:border-[#242a33] sm:order-none sm:w-auto sm:border-0 sm:pt-0">
        <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
          <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" name="search" />
          <input aria-label="Search tasks" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-100" onChange={(event) => onSearch(event.target.value)} placeholder="Search tasks…" value={search} />
        </label>
        <select aria-label="Filter by status" className="h-9 min-w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 dark:border-[#343b47] dark:bg-[#14171c] dark:text-slate-200" onChange={(event) => onStatus(event.target.value)} value={status}>
          <option value="all">All statuses</option><option value="open">Not done</option>
          <option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option><option value="merged">Merged</option><option value="closed">Closed</option>
        </select>
      </div>
    </header>
  );
}
