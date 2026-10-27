const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2023-10-28" → "28 de outubro de 2023"; com fim, "19 de novembro a 18 de dezembro de 2022". */
export function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  const startDate = new Date(`${start}T00:00:00Z`);
  if (Number.isNaN(startDate.getTime())) return null;
  if (!end || end === start) return dateFormat.format(startDate);

  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(endDate.getTime())) return dateFormat.format(startDate);
  return dateFormat.formatRange(startDate, endDate);
}
