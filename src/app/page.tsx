"use client";

import { useEffect, useState, useCallback } from "react";

interface Advocate {
	id: number;
	firstName: string;
	lastName: string;
	city: string;
	degree: string;
	specialties: string[];
	yearsOfExperience: number;
	phoneNumber: number;
	createdAt?: string;
}

export default function Home() {
	const [advocates, setAdvocates] = useState<Advocate[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	// Debounced search term for server-side search
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

	// Ensure component is mounted before rendering data
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Debounce effect for search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300); // 300ms debounce delay

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Fetch advocates with server-side search
	const fetchAdvocates = useCallback(async (search?: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const params = new URLSearchParams();

			if (search && search.trim()) {
				params.append("search", search.trim());
			}

			console.log(
				`Fetching advocates: ${search ? `search="${search}"` : "no search"}`
			);

			const response = await fetch(`/api/advocates?${params}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch advocates: ${response.status}`);
			}

			const jsonResponse = await response.json();
			setAdvocates(jsonResponse.data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Error fetching advocates:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

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
	}, [debouncedSearchTerm, fetchAdvocates, searchTerm, isMounted]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const onClick = () => {
		console.log(advocates);
		setSearchTerm("");
	};

	if (!isMounted) {
		return (
			<main style={{ margin: "24px" }}>
				<h1>Solace Advocates</h1>
				<p>Loading...</p>
			</main>
		);
	}

	if (isLoading) {
		return (
			<main style={{ margin: "24px" }}>
				<h1>Solace Advocates</h1>
				<p>Loading advocates...</p>
			</main>
		);
	}

	if (error) {
		return (
			<main style={{ margin: "24px" }}>
				<h1>Solace Advocates</h1>
				<p style={{ color: "red" }}>Error: {error}</p>
				<button onClick={() => window.location.reload()}>Retry</button>
			</main>
		);
	}

	return (
		<main style={{ margin: "24px" }}>
			<h1>Solace Advocates</h1>
			<br />
			<br />
			<div>
				<p>Search</p>
				<p>
					Searching for: <span>{searchTerm}</span>
				</p>
				{debouncedSearchTerm !== searchTerm && searchTerm && (
					<p style={{ fontSize: "0.9em", color: "#666" }}>Searching...</p>
				)}
				<input
					style={{ border: "1px solid black" }}
					value={searchTerm}
					onChange={onChange}
					placeholder="Search advocates..."
				/>
				<button onClick={onClick}>Reset Search</button>
				<p style={{ fontSize: "0.9em", color: "#555" }}>
					Showing {advocates.length} advocates
				</p>
			</div>
			<br />
			<br />
			<table>
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>City</th>
						<th>Degree</th>
						<th>Specialties</th>
						<th>Years of Experience</th>
						<th>Phone Number</th>
					</tr>
				</thead>
				<tbody>
					{advocates.map((advocate: Advocate) => {
						return (
							<tr key={advocate.id}>
								<td>{advocate.firstName}</td>
								<td>{advocate.lastName}</td>
								<td>{advocate.city}</td>
								<td>{advocate.degree}</td>
								<td>
									{advocate.specialties.map((specialty: string) => (
										<div key={`${advocate.id}-${specialty}`}>{specialty}</div>
									))}
								</td>
								<td>{advocate.yearsOfExperience}</td>
								<td>{advocate.phoneNumber}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}
