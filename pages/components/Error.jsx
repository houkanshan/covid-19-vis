export default function Error({ error }) {
  return <div className="error">Error: {JSON.stringify(error)}</div>
}