'use client';

import { useEffect, useRef } from 'react';
import type { PickableFeature } from '../../lib/cesium/pickableGeoJson';
import { RIDGE_OCEANS, RIDGE_TIERS, RidgeFilter } from '../../lib/cesium/exRidges';

/**
 * The ExRidges view's "Filter Dialog" and "Ridges List" dialogs from the old
 * ExRidgesView.js, folded into one card: the filter decides both what's drawn
 * and what's listed, and picking from the list flies to and selects the ridge.
 */
export function RidgesPanel({
  filter,
  onFilterChange,
  ridges,
  selected,
  onPick,
}: {
  filter: RidgeFilter;
  onFilterChange: (next: RidgeFilter) => void;
  ridges: PickableFeature[];
  selected: PickableFeature | null;
  onPick: (ridge: PickableFeature) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // a ridge clicked on the globe scrolls into view in the list
  useEffect(() => {
    if (!selected) return;
    listRef.current
      ?.querySelector(`[data-key="${CSS.escape(selected.key)}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const toggle = (list: string[], value: string, on: boolean) =>
    on ? [...list, value] : list.filter((v) => v !== value);

  return (
    <section className="cesium-view-ridges" aria-label="Ridges">
      <details open>
        <summary>Filter</summary>
        <fieldset>
          {RIDGE_OCEANS.map(([value, label]) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={filter.oceans.includes(value)}
                onChange={(e) =>
                  onFilterChange({ ...filter, oceans: toggle(filter.oceans, value, e.target.checked) })
                }
              />
              {label}
            </label>
          ))}
        </fieldset>
        <fieldset>
          {RIDGE_TIERS.map((value) => (
            <label key={value}>
              <input
                type="checkbox"
                checked={filter.tiers.includes(value)}
                onChange={(e) =>
                  onFilterChange({ ...filter, tiers: toggle(filter.tiers, value, e.target.checked) })
                }
              />
              {value}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <label>
            <input
              type="checkbox"
              checked={filter.active}
              onChange={(e) => onFilterChange({ ...filter, active: e.target.checked })}
            />
            Active Ridges
          </label>
          <label>
            <input
              type="checkbox"
              checked={filter.analyzedActive}
              onChange={(e) => onFilterChange({ ...filter, analyzedActive: e.target.checked })}
            />
            Analyzed Active Ridges
          </label>
        </fieldset>
      </details>

      <h2>
        Ridges <span>{ridges.length}</span>
      </h2>
      <ul ref={listRef}>
        {ridges.map((ridge) => (
          <li key={ridge.key} data-key={ridge.key}>
            <button
              type="button"
              title={ridge.name}
              aria-current={ridge === selected ? 'true' : undefined}
              onClick={() => onPick(ridge)}
            >
              {ridge.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
