"use client";

import { useState } from "react";
import type { Advocate } from "../../types/advocate";

interface AdvocateTableProps {
	advocates: Advocate[];
	isLoading: boolean;
	searchTerm: string;
	onClearSearch: () => void;
}

export default function AdvocateTable({
	advocates,
	isLoading,
	searchTerm,
	onClearSearch,
}: AdvocateTableProps) {
	const [expandedSpecialties, setExpandedSpecialties] = useState<Set<number>>(
		new Set()
	);

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

	// Empty State
	if (advocates.length === 0 && !isLoading) {
		return (
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
						We couldn&apos;t find any advocates matching your search criteria.
						Try adjusting your search terms or clear the search to see all
						advocates.
					</p>
					{searchTerm && (
						<button
							onClick={onClearSearch}
							className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
						>
							Show All Advocates
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
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
	);
}
