export default function showError(
  setError: (err: string) => void,
  err: string
) {
  setError(err);
  setTimeout(() => setError(""), 2000);
}
export function showSuccess(
  setError: (err: string) => void,
  err: string = "Successful!"
) {
  setError(err);
  setTimeout(() => setError(""), 2000);
}
