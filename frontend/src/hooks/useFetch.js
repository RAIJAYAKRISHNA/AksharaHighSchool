import { useCallback, useEffect, useState } from "react";

function useFetch(fetcher) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError("");

        fetcher()
            .then((response) => {
                if (!cancelled) {
                    setData(response.data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("We could not load this right now. Please try again.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [fetcher, attempt]);

    const retry = useCallback(() => setAttempt((count) => count + 1), []);

    return { data, loading, error, retry };
}

export default useFetch;