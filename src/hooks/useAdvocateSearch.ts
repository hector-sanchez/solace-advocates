"use client";

import { useState, useEffect, useCallback } from "react";
import type { Advocate } from "../types/advocate";

export function useAdvocateSearch() {
	const [advocates, setAdvocates] = useState<Advocate[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Mark component as mounted to prevent hydration issues
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const fetchAdvocates = useCallback(
		async (search?: string) => {
			if (!isMounted) return;

			try {
				setIsSearching(true);
				const response = await fetch(
					`/api/advocates${
						search ? `?search=${encodeURIComponent(search)}` : ""
					}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch advocates");
				}

				const data = await response.json();
				setAdvocates(data.data || data);
			} catch (error) {
				console.error("Error fetching advocates:", error);
				setAdvocates([]);
			} finally {
				setIsSearching(false);
			}
		},
		[isMounted]
	);

	// Initial fetch only after component is mounted
	useEffect(() => {
		if (isMounted) {
			fetchAdvocates();
		}
	}, [fetchAdvocates, isMounted]);

	// Search when debounced term changes (only if mounted)
	useEffect(() => {
		if (!isMounted) return;

		if (debouncedSearchTerm !== "") {
			fetchAdvocates(debouncedSearchTerm);
		} else if (debouncedSearchTerm === "" && searchTerm === "") {
			// Reset to show all advocates when search is cleared
			fetchAdvocates();
		}
	}, [debouncedSearchTerm, searchTerm, fetchAdvocates, isMounted]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchTerm(e.target.value);
		},
		[]
	);

	const handleClearSearch = useCallback(() => {
		setSearchTerm("");
		setDebouncedSearchTerm("");
	}, []);

	return {
		advocates,
		searchTerm,
		isSearching,
		isMounted,
		handleSearchChange,
		handleClearSearch,
	};
}
