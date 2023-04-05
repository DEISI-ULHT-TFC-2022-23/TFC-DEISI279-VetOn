export default function Content({ username = false }) {
  if (!username) {
    return <div>ola</div>;
  } else {
    return <div>adeus</div>;
  }
}
