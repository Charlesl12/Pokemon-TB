// Taken from previous project
export default function LoadingSpinner({ size = 24 }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }}
        />
    );
}
