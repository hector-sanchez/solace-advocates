"use client";

import AdvocateTable from "./(components)/AdvocateTable";
import SearchBox from "./(components)/SearchBox";
import { useAdvocateSearch } from "../hooks/useAdvocateSearch";

export default function Home() {
	const {
		advocates,
		searchTerm,
		isSearching,
		isMounted,
		handleSearchChange,
		handleClearSearch,
	} = useAdvocateSearch();

	// Prevent hydration mismatch by only rendering content after mounting
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
					<SearchBox
						searchTerm={searchTerm}
						onChange={handleSearchChange}
						onClearSearch={handleClearSearch}
						isSearching={isSearching}
						resultsCount={advocates.length}
					/>

					{/* Results Section */}
					<AdvocateTable
						advocates={advocates}
						isLoading={false}
						searchTerm={searchTerm}
						onClearSearch={handleClearSearch}
					/>
				</div>
			</div>
		</main>
	);
}
