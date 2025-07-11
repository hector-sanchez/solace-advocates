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
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(
		new Set()
	);

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
			// Only show main loading for initial load, use searching state for search
			if (!search) {
				setIsLoading(true);
			} else {
				setIsSearching(true);
			}
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
			// Clear appropriate loading state
			if (!search) {
				setIsLoading(false);
			} else {
				setIsSearching(false);
			}
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

	const toggleSpecialties = (advocateId: number) => {
		setExpandedSpecialties((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(advocateId)) {
				newSet.delete(advocateId);
			} else {
				newSet.add(advocateId);
			}
			return newSet;
		});
	};

	if (!isMounted) {
		return (
			<main className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-6 py-8">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h1 className="text-5xl font-bold text-blue-900 mb-4">
								Solace Advocates
							</h1>
						</div>
						<div className="flex items-center justify-center min-h-64">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
								<span className="loading-text text-lg text-gray-600 font-medium">
									Initializing...
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (isLoading) {
		return (
			<main className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-6 py-8">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h1 className="text-5xl font-bold text-blue-900 mb-4">
								Solace Advocates
							</h1>
						</div>
						<div className="flex items-center justify-center min-h-64">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
								<span className="loading-text text-lg text-gray-600 font-medium">
									Loading advocates...
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="min-h-screen bg-gray-50">
				<div className="container mx-auto px-6 py-8">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-12">
							<h1 className="text-5xl font-bold text-blue-900 mb-4">
								Solace Advocates
							</h1>
						</div>
						<div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center max-w-2xl mx-auto">
							<div className="text-red-500 mb-6">
								<svg
									className="w-16 h-16 mx-auto mb-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Oops! Something went wrong
							</h3>
							<p className="text-red-700 text-lg font-medium mb-6 bg-red-50 rounded-lg p-4">
								{error}
							</p>
							<button
								onClick={() => window.location.reload()}
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
							>
								Try Again
							</button>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-6 py-8">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold text-blue-900 mb-4">
							Solace Advocates
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Find the right mental health advocate for your needs with our
							comprehensive directory
						</p>
					</div>

					{/* Search Section */}
					<div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
						<div className="max-w-2xl mx-auto">
							<label
								htmlFor="search"
								className="block text-sm font-semibold text-gray-700 mb-3"
							>
								Search Advocates
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<svg
										className="h-6 w-6 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<input
									id="search"
									type="text"
									className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
									placeholder="Search by name, city, degree, specialty, or experience..."
									value={searchTerm}
									onChange={onChange}
								/>
							</div>

							<div className="flex items-center justify-between mt-6">
								<div className="flex items-center space-x-4">
									{searchTerm && (
										<div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
											Searching for:{" "}
											<span className="font-semibold text-gray-900">
												&ldquo;{searchTerm}&rdquo;
											</span>
										</div>
									)}
									{isSearching && searchTerm && (
										<div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
											Searching...
										</div>
									)}
								</div>

								<div className="flex items-center space-x-4">
									<span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
										{advocates.length} advocates found
									</span>
									{searchTerm && (
										<button
											onClick={onClick}
											className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg"
										>
											Clear Search
										</button>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Results Section */}
					<div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Name
										</th>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Location
										</th>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Credentials
										</th>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Specialties
										</th>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Experience
										</th>
										<th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
											Contact
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{advocates.map((advocate: Advocate) => (
										<tr
											key={advocate.id}
											className="advocate-row hover:bg-gray-50"
										>
											<td className="px-8 py-6 whitespace-nowrap">
												<div className="text-sm font-bold text-gray-900">
													{advocate.firstName} {advocate.lastName}
												</div>
											</td>
											<td className="px-8 py-6 whitespace-nowrap">
												<div className="text-sm text-gray-900 flex items-center">
													<svg
														className="w-4 h-4 text-gray-400 mr-2"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
															clipRule="evenodd"
														/>
													</svg>
													{advocate.city}
												</div>
											</td>
											<td className="px-8 py-6 whitespace-nowrap">
												<span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
													{advocate.degree}
												</span>
											</td>
											<td className="px-8 py-6">
												<div className="max-w-xs">
													<div className="flex flex-wrap gap-2">
														{(expandedSpecialties.has(advocate.id)
															? advocate.specialties
															: advocate.specialties.slice(0, 3)
														).map((specialty: string, index: number) => (
															<span
																key={`${advocate.id}-${specialty}`}
																className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800"
															>
																{specialty}
															</span>
														))}
														{advocate.specialties.length > 3 &&
															!expandedSpecialties.has(advocate.id) && (
																<button
																	onClick={() => toggleSpecialties(advocate.id)}
																	className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
																>
																	+{advocate.specialties.length - 3} more
																</button>
															)}
														{advocate.specialties.length > 3 &&
															expandedSpecialties.has(advocate.id) && (
																<button
																	onClick={() => toggleSpecialties(advocate.id)}
																	className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
																>
																	Show less
																</button>
															)}
													</div>
												</div>
											</td>
											<td className="px-8 py-6 whitespace-nowrap">
												<div className="text-sm font-semibold text-gray-900 flex items-center">
													<svg
														className="w-4 h-4 text-gray-400 mr-2"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
															clipRule="evenodd"
														/>
													</svg>
													{advocate.yearsOfExperience} years
												</div>
											</td>
											<td className="px-8 py-6 whitespace-nowrap">
												<div className="phone-number text-sm bg-gray-50 px-3 py-2 rounded-lg inline-block">
													{advocate.phoneNumber
														.toString()
														.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* Empty State */}
					{advocates.length === 0 && !isLoading && (
						<div className="empty-state text-center py-16 rounded-2xl">
							<div className="max-w-md mx-auto">
								<svg
									className="mx-auto h-16 w-16 text-gray-400 mb-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									No advocates found
								</h3>
								<p className="text-gray-600 mb-6">
									We couldn&apos;t find any advocates matching your search
									criteria. Try adjusting your search terms or clear the search
									to see all advocates.
								</p>
								{searchTerm && (
									<button
										onClick={onClick}
										className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
									>
										Show All Advocates
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
