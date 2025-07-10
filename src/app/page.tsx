"use client";

import { useEffect, useState } from "react";

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
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
				setFilteredAdvocates(jsonResponse.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				console.error("Error fetching advocates:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAdvocates();
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);

		console.log("filtering advocates...");
		const filtered = advocates.filter((advocate) => {
			return (
				advocate.firstName
					.toLowerCase()
					.includes(newSearchTerm.toLowerCase()) ||
				advocate.lastName.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
				advocate.city.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
				advocate.degree.toLowerCase().includes(newSearchTerm.toLowerCase()) ||
				advocate.specialties.some((specialty) =>
					specialty.toLowerCase().includes(newSearchTerm.toLowerCase())
				) ||
				advocate.yearsOfExperience.toString().includes(newSearchTerm)
			);
		});

		setFilteredAdvocates(filtered);
	};

  const onClick = () => {
		console.log(advocates);
		setSearchTerm("");
		setFilteredAdvocates(advocates);
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
				<input
					style={{ border: "1px solid black" }}
					value={searchTerm}
					onChange={onChange}
					placeholder="Search advocates..."
				/>
				<button onClick={onClick}>Reset Search</button>
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
					{filteredAdvocates.map((advocate) => {
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
