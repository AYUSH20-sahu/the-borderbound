"useclient";

import React from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";
import { SectorType, ContestantStatus, ArchetypeType } from "@/types/contestant";

interface FilterState {
  search: string;
  sector: string;
  status: string;
  archetype: string;
  sortBy: "name" | "strategy" | "endurance" | "survival";
}

interface ContestantFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const SECTORS = [
  { label: "All Sectors", val: "all" },
  { label: "Alpha (Permafrost)", val: "Alpha" },
  { label: "Beta (Scorch Basin)", val: "Beta" },
  { label: "Gamma (Blackwood Mire)", val: "Gamma" },
  { label: "Delta (Iron Compound)", val: "Delta" },
];

const ARCHETYPES = [
  "All Archetypes",
  "The Tactician",
  "The Survivalist",
  "The Diplomat",
  "The Enforcer",
  "The Underdog",
  "The Wildcard",
];

const STATUSES = [
  { label: "All Statuses", val: "all" },
  { label: "Active", val: "active" },
  { label: "Immunity Holders", val: "immunity_holder" },
  { label: "Tribunal Risk", val: "tribunal_risk" },
  { label: "Exiled / Eliminated", val: "eliminated" },
];

export default function ContestantFilter({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}: ContestantFilterProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleSectorChange = (val: string) => {
    onFilterChange({ ...filters, sector: val });
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({ ...filters, status: val });
  };

  const handleArchetypeChange = (val: string) => {
    onFilterChange({ ...filters, archetype: val });
  };

  const handleSortChange = (val: FilterState["sortBy"]) => {
    onFilterChange({ ...filters, sortBy: val });
  };

  const resetFilters = () => {
    onFilterChange({
      search: "",
      sector: "all",
      status: "all",
      archetype: "All Archetypes",
      sortBy: "name",
    });
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.sector !== "all" ||
    filters.status !== "all" ||
    filters.archetype !== "All Archetypes" ||
    filters.sortBy !== "name";

  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* Search and Sort Top Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by contestant name, hometown, or occupation..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0E121B] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Status Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0E121B] border border-white/10 rounded-xl px-3 py-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.val} value={s.val} className="bg-[#0E121B] text-white">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#0E121B] border border-white/10 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as FilterState["sortBy"])}
              className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              <option value="name" className="bg-[#0E121B] text-white">Name (A-Z)</option>
              <option value="strategy" className="bg-[#0E121B] text-white">Highest Strategy</option>
              <option value="endurance" className="bg-[#0E121B] text-white">Highest Endurance</option>
              <option value="survival" className="bg-[#0E121B] text-white">Highest Survival</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Sector Pill Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 mr-1">
          SECTOR:
        </span>
        {SECTORS.map((s) => {
          const isSelected = filters.sector === s.val;
          return (
            <button
              key={s.val}
              onClick={() => handleSectorChange(s.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                isSelected
                  ? "bg-red-600 text-white font-bold shadow-md shadow-red-900/40"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Archetype Filter Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 mr-1">
          ARCHETYPE:
        </span>
        {ARCHETYPES.map((arch) => {
          const isSelected = filters.archetype === arch;
          return (
            <button
              key={arch}
              onClick={() => handleArchetypeChange(arch)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all duration-150 ${
                isSelected
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                  : "bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-white/10"
              }`}
            >
              {arch}
            </button>
          );
        })}
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
        <span>
          DISPLAYING <strong className="text-white">{filteredCount}</strong> OF{" "}
          <strong className="text-white">{totalCount}</strong> CONTESTANTS
        </span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active (24)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Immunity (4)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Exiled (4)
          </span>
        </div>
      </div>
    </div>
  );
}
