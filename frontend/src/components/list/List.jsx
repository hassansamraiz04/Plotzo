import EmptyState from "../EmptyState/EmptyState";
import "./list.scss";
import Card from "../Card/Card";

function List({ posts }) {
  if (!posts?.length) {
    return <EmptyState title="No listings found" subtitle="Nothing to show right now." />;
  }

  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;
