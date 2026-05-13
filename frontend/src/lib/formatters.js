export function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date(value));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function getApiError(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || fallback;
}
