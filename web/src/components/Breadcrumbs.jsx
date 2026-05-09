import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="crumb">
            {item.to && !last ? <Link to={item.to}>{item.label}</Link> : <strong>{item.label}</strong>}
            {!last && <em>/</em>}
          </span>
        );
      })}
    </nav>
  );
}
