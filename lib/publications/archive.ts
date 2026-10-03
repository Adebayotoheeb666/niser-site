export interface PublicationArchiveItem {
  id: string;
  slug: string;
  title: string;
  abstract?: string | null;
  publicationType?: string | null;
  publishedYear?: number | null;
  researchDivision?: string | null;
  pdfFile?: string | null;
  authors?: Array<{ fullName?: string | null }> | null;
}

function normalizeType(value: string): string {
  return value.trim().replace(/[_-]+/g, " ").toLowerCase();
}

export function filterPublications(
  publications: PublicationArchiveItem[],
  searchTerm: string,
  selectedType: string,
  selectedYear: string,
): PublicationArchiveItem[] {
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const normalizedSelectedType = normalizeType(selectedType || "all");

  return publications.filter((publication) => {
    const publicationType = normalizeType(publication.publicationType ?? "");
    const typeMatch =
      normalizedSelectedType === "all" || publicationType === normalizedSelectedType;

    const yearMatch =
      selectedYear === "all" ||
      String(publication.publishedYear ?? "") === selectedYear;

    if (!normalizedQuery && typeMatch && yearMatch) {
      return true;
    }

    const authorNames = (publication.authors ?? [])
      .map((author) => author.fullName ?? "")
      .join(" ")
      .toLowerCase();

    const haystack = [
      publication.title,
      publication.abstract ?? "",
      publication.researchDivision ?? "",
      authorNames,
      publicationType,
    ]
      .join(" ")
      .toLowerCase();

    const includesQuery = haystack.includes(normalizedQuery);

    return includesQuery && typeMatch && yearMatch;
  });
}
