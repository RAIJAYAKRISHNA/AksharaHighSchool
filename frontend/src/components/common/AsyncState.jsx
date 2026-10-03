import Button from "./Button.jsx";
import Loading from "./Loading.jsx";

function AsyncState({ loading, error, onRetry, loadingText = "Loading...", children }) {
    if (loading) {
        return <Loading text={loadingText} />;
    }

    if (error) {
        return (
            <div className="form-message form-message--error" role="alert">
                <p>{error}</p>
                {onRetry && (
                    <Button size="sm" variant="outline" onClick={onRetry}>
                        Try Again
                    </Button>
                )}
            </div>
        );
    }

    return children;
}

export default AsyncState;