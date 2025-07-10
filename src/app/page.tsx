"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

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

	// Debounced search term for better performance
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

	// Debounce effect for search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300); // 300ms debounce delay

		return () => clearTimeout(timer);
	}, [searchTerm]);

  useEffect(() => {
		const fetchAdvocates = async () => {
			try {
				setIsLoading(true);
				setError(null);
				console.log("fetching advocates...");

				const response = await fetch("/api/advocates");
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
		};

		fetchAdvocates();
	}, []);

	// Memoized search function for better performance
	const filterAdvocates = useCallback((advocates: Advocate[], searchTerm: string): Advocate[] => {
		if (!searchTerm.trim()) {
			return advocates;
		}

		const lowerSearchTerm = searchTerm.toLowerCase();
		console.log("filtering advocates...");
		
		return advocates.filter((advocate) => {
			const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
			const cityLower = advocate.city.toLowerCase();
			const degreeLower = advocate.degree.toLowerCase();
			const specialtiesLower = advocate.specialties.map(s => s.toLowerCase());
			const yearsString = advocate.yearsOfExperience.toString();

			return (
				fullName.includes(lowerSearchTerm) ||
				advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
				advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
				cityLower.includes(lowerSearchTerm) ||
				degreeLower.includes(lowerSearchTerm) ||
				specialtiesLower.some(specialty => specialty.includes(lowerSearchTerm)) ||
				yearsString.includes(lowerSearchTerm)
			);
		});
	}, []);

	// Memoized filtered advocates based on debounced search term
	const filteredAdvocates = useMemo(() => {
		return filterAdvocates(advocates, debouncedSearchTerm);
	}, [advocates, debouncedSearchTerm, filterAdvocates]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

  const onClick = () => {
		console.log(advocates);
		setSearchTerm("");
	};

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
					Showing {filteredAdvocates.length} of {advocates.length} advocates
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
					{filteredAdvocates.map((advocate: Advocate) => {
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
