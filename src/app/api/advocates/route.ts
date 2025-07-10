import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { or, ilike, sql } from "drizzle-orm";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const searchTerm = searchParams.get("search");

	try {
		// Check if we have a real database connection
		if (db) {
			// Use real database with optimized search and indexing
			console.log(
				`Using database search for: "${searchTerm || "all records"}"`
			);

			if (searchTerm && searchTerm.trim()) {
				const searchPattern = `%${searchTerm.toLowerCase()}%`;
				const data = await db
					.select()
					.from(advocates)
					.where(
						or(
							ilike(advocates.firstName, searchPattern),
							ilike(advocates.lastName, searchPattern),
							ilike(advocates.city, searchPattern),
							ilike(advocates.degree, searchPattern),
							// For PostgreSQL full-text search on JSONB specialties
							sql`${advocates.specialties}::text ILIKE ${searchPattern}`,
							// Search in years of experience (convert to text)
							sql`${advocates.yearsOfExperience}::text LIKE ${searchPattern}`,
							// Full name search (concatenated)
							sql`CONCAT(${advocates.firstName}, ' ', ${advocates.lastName}) ILIKE ${searchPattern}`
						)
					);

				console.log(`Database returned ${data.length} advocates`);
				return Response.json({ data });
			} else {
				// No search term, return all advocates
				const data = await db.select().from(advocates);
				console.log(`Database returned ${data.length} advocates`);
				return Response.json({ data });
			}
		} else {
			// Fallback to mock data with server-side filtering
			console.log(
				`Using mock data search for: "${searchTerm || "all records"}"`
			);

			let filteredData = advocateData;

			if (searchTerm && searchTerm.trim()) {
				const lowerSearchTerm = searchTerm.toLowerCase();
				filteredData = advocateData.filter((advocate) => {
					const fullName =
						`${advocate.firstName} ${advocate.lastName}`.toLowerCase();
					const specialtiesText = advocate.specialties.join(" ").toLowerCase();

					return (
						fullName.includes(lowerSearchTerm) ||
						advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
						advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
						advocate.city.toLowerCase().includes(lowerSearchTerm) ||
						advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
						specialtiesText.includes(lowerSearchTerm) ||
						advocate.yearsOfExperience.toString().includes(lowerSearchTerm)
					);
				});
			}

			console.log(`Mock data returned ${filteredData.length} advocates`);

			return Response.json({
				data: filteredData,
			});
		}
	} catch (error) {
		console.error("Error in advocates API:", error);
		return Response.json(
			{ error: "Failed to fetch advocates" },
			{ status: 500 }
		);
	}
}
