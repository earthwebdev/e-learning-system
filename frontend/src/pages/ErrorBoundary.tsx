
const ErrorBoundaryPage = () => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  )
}

export default ErrorBoundaryPage