"use client";

interface SearchBoxProps {
	searchTerm: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClearSearch: () => void;
	isSearching: boolean;
	resultsCount: number;
}

export default function SearchBox({ 
	searchTerm, 
	onChange, 
	onClearSearch, 
	isSearching, 
	resultsCount 
}: SearchBoxProps) {
	return (
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
							{resultsCount} advocates found
						</span>
						{searchTerm && (
							<button
								onClick={onClearSearch}
								className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg"
							>
								Clear Search
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
