import { useMemo, useCallback } from "react";
import { useSearchParams } from "wouter";

interface FilterConfig {
  key: string;
  defaultValue: string;
}

interface UseUrlFiltersOptions {
  pageKey: string;
  filters: FilterConfig[];
}

export function useUrlFilters(options: UseUrlFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const result: Record<string, string> = {};
    options.filters.forEach(filter => {
      const paramKey = `${options.pageKey}_${filter.key}`;
      const value = searchParams.get(paramKey);
      result[filter.key] = value ?? filter.defaultValue;
    });
    return result;
  }, [searchParams, options]);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const filter = options.filters.find(f => f.key === key);
      if (!filter) return;

      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        const paramKey = `${options.pageKey}_${key}`;

        if (value === filter.defaultValue) {
          newParams.delete(paramKey);
        } else {
          newParams.set(paramKey, value);
        }

        return newParams;
      });
    },
    [setSearchParams, options]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      options.filters.forEach(filter => {
        newParams.delete(`${options.pageKey}_${filter.key}`);
      });
      return newParams;
    });
  }, [setSearchParams, options]);

  const hasActiveFilters = useMemo(() => {
    return options.filters.some(
      filter => filters[filter.key] !== filter.defaultValue
    );
  }, [filters, options]);

  return {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
  };
}
