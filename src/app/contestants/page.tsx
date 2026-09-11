"useclient";

import React, { useState, useMemo } from "react";
import { CONTESTANTS_DATA } from "@/data/contestants";
import { Contestant } from "@/types/contestant";
import ContestantCard from "@/components/contestants/ContestantCard";
import ContestantModal from "@/components/contestants/ContestantModal";
import ContestantFilter from "@/components/contestants/ContestantFilter";
import { Users, Shield, Award, Skull, SearchX } from "lucide-react";

export default function ContestantsGalleryPage() {
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    sector: "all",
    status: "all",
    archetype: "All Archetypes",
    sortBy: "name" as "name" | "strategy" | "endurance" | "survival",
  });

  // Filter and Sort Logic
  const filteredContestants = useMemo(() => {
    let result = [...CONTESTANTS_DATA];

    // Search query
    if (filters.search.trim() !== "") {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.hometown.toLowerCase().includes(q) ||
          c.occupation.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
      );
    }

    // Sector
    if (filters.sector !== "all") {
      result = result.filter((c) => c.sector.includes(filters.sector));
    }

    // Status
    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }

    // Archetype
    if (filters.archetype !== "All Archetypes") {
      result = result.filter((c) => c.archetype === filters.archetype);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === "strategy") return b.stats.strategy - a.stats.strategy;
      if (filters.sortBy === "endurance") return b.stats.endurance - a.stats.endurance;
      if (filters.sortBy === "survival") return b.stats.survival - a.stats.survival;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [filters]);

  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>Official Season 1 Cast Dossier</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
          The 32 Competitors
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          32 contestants divided into 4 hostile wilderness sectors. Click any contestant to inspect their full tactical dossier, alliance loyalties, survival index, and personal strategy.
        </p>
      </div>

      {/* Interactive Filters Bar */}
      <ContestantFilter
        filters={filters}
        onFilterChange={setFilters}
        totalCount={CONTESTANTS_DATA.length}
        filteredCount={filteredContestants.length}
      />

      {/* Grid of Contestants */}
      {filteredContestants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContestants.map((contestant) => (
            <ContestantCard
              key={contestant.id}
              contestant={contestant}
              onSelect={setSelectedContestant}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center max-w-md mx-auto my-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-400 mb-4">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase mb-2">
            No Contestants Found
          </h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            No competitors matched your search or active filter combination. Try resetting your query or clearing sector filters.
          </p>
          <button
            onClick={() =>
              setFilters({
                search: "",
                sector: "all",
                status: "all",
                archetype: "All Archetypes",
                sortBy: "name",
              })
            }
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detail Dossier Modal */}
      <ContestantModal
        contestant={selectedContestant}
        onClose={() => setSelectedContestant(null)}
      />
    </div>
  );
}
