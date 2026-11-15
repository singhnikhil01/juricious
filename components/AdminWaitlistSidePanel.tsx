'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { WaitlistStatus } from '../lib/types';

export function AdminWaitlistSidePanel() {
  const {
    selectedWaitlistEntry,
    setSelectedWaitlistEntry,
    updateWaitlistStatus,
    updateWaitlistInternalNotes,
    deleteWaitlistEntry,
  } = useApp();

  const [notesDraft, setNotesDraft] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (selectedWaitlistEntry) {
      setNotesDraft(selectedWaitlistEntry.internalNotes || '');
      setConfirmDelete(false);
      setStatusNote('');
    }
  }, [selectedWaitlistEntry]);

  if (!selectedWaitlistEntry) return null;

  const handleSaveNotes = () => {
    updateWaitlistInternalNotes(selectedWaitlistEntry.id, notesDraft);
  };

  const handleStatusChange = (newStatus: WaitlistStatus) => {
    updateWaitlistStatus(selectedWaitlistEntry.id, newStatus, statusNote.trim() || undefined);
    setStatusNote('');
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    } else {
      deleteWaitlistEntry(selectedWaitlistEntry.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-panel-title"
    >
      {/* Backdrop */}
      <div className="flex-1" onClick={() => setSelectedWaitlistEntry(null)} />

      {/* Drawer */}
      <div className="w-full max-w-xl bg-[#1A1A1A] border-l border-[#262626] text-white h-full overflow-y-auto flex flex-col justify-between shadow-2xl z-10">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#262626] flex items-center justify-between sticky top-0 bg-[#1A1A1A] z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#A3A3A3]">
                {selectedWaitlistEntry.id}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  selectedWaitlistEntry.status === 'New'
                    ? 'bg-[#FF9933] text-black'
                    : selectedWaitlistEntry.status === 'Contacted'
                    ? 'bg-[#2E9E5B] text-white'
                    : 'bg-[#1A1A1A] border border-[#333333] text-white'
                }`}
              >
                {selectedWaitlistEntry.status}
              </span>
            </div>
            <h2 id="side-panel-title" className="text-xl font-bold font-serif text-white mt-1">
              {selectedWaitlistEntry.name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedWaitlistEntry(null)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Contact Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-[#0A0A0A] p-4 rounded-lg border border-[#262626] text-sm">
            <div>
              <span className="text-xs text-[#A3A3A3] block">Email</span>
              <a
                href={`mailto:${selectedWaitlistEntry.email}`}
                className="text-white hover:text-[#FF9933] font-medium break-all underline decoration-1 underline-offset-2"
              >
                {selectedWaitlistEntry.email}
              </a>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block">Phone</span>
              <span className="text-white font-mono">
                {selectedWaitlistEntry.phone || 'Not provided'}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block">Chambers Role</span>
              <span className="text-white font-medium">
                {selectedWaitlistEntry.role}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block">Practises At</span>
              <span className="text-white">
                {selectedWaitlistEntry.place || 'General Chambers'}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block">First Priority Feature</span>
              <span className="text-[#FF9933] font-medium">
                {selectedWaitlistEntry.firstFeature || 'Not specified'}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#A3A3A3] block">Source</span>
              <span className="text-xs text-[#A3A3A3] font-mono">
                {selectedWaitlistEntry.source}
              </span>
            </div>
          </div>

          {/* User Submitted Note */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
              Chambers Note from Applicant
            </span>
            <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#262626] text-sm text-white leading-relaxed">
              {selectedWaitlistEntry.note ? (
                <p className="whitespace-pre-wrap">{selectedWaitlistEntry.note}</p>
              ) : (
                <span className="italic text-[#737373]">No note provided with submission.</span>
              )}
            </div>
          </div>

          {/* Status Transition Control */}
          <div className="p-4 rounded-lg bg-[#262626] border border-[#333333] space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Update Status
            </span>
            <div className="flex flex-wrap gap-2">
              {(['New', 'Contacted', 'Invited'] as WaitlistStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    selectedWaitlistEntry.status === st
                      ? 'bg-[#FF9933] text-black ring-2 ring-white'
                      : 'bg-[#1A1A1A] text-[#A3A3A3] hover:text-white hover:bg-[#333333]'
                  }`}
                >
                  Mark as {st}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Optional audit log note (e.g. 'Introductory phone call completed')"
              className="w-full h-10 px-3 rounded bg-[#1A1A1A] border border-[#333333] text-xs text-white placeholder-[#737373] focus:border-[#FF9933] focus:outline-none"
            />
          </div>

          {/* Internal Team Notes (Editable) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                Private Internal Notes (Chambers Team Only)
              </span>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="text-xs font-bold px-3 py-1 rounded bg-[#FF9933] text-black hover:bg-[#ffa94d] transition-colors cursor-pointer"
              >
                Save notes
              </button>
            </div>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Add internal notes on court jurisdiction, team size, invite priority..."
              className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-[#FF9933] transition-colors"
            />
          </div>

          {/* Status Change History */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] block">
              Audit History
            </span>
            <div className="space-y-2">
              {selectedWaitlistEntry.statusHistory.map((hist, i) => (
                <div
                  key={i}
                  className="p-3 rounded bg-[#0A0A0A] border border-[#262626] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[#A3A3A3]">
                    <span className="font-semibold text-white">Status: {hist.status}</span>
                    <span className="font-mono text-[11px]">
                      {new Date(hist.changedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A3A3A3]">
                    Changed by: <span className="text-white">{hist.changedBy}</span>
                  </div>
                  {hist.note && (
                    <div className="text-white italic bg-[#1A1A1A] p-1.5 rounded mt-1">
                      "{hist.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer with Two-Step Delete */}
        <div className="p-4 border-t border-[#262626] bg-[#1A1A1A] flex items-center justify-between">
          <button
            onClick={handleDeleteClick}
            className={`min-h-[44px] px-4 rounded text-xs font-bold transition-all cursor-pointer ${
              confirmDelete
                ? 'bg-[#E5484D] text-white animate-pulse'
                : 'bg-[#262626] text-[#E5484D] hover:bg-[#333333]'
            }`}
          >
            {confirmDelete ? 'Confirm delete (4s)' : 'Delete entry'}
          </button>

          <button
            onClick={() => setSelectedWaitlistEntry(null)}
            className="min-h-[44px] px-5 rounded bg-[#262626] text-white text-xs font-medium hover:bg-[#333333] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
