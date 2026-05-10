import "./ListPage.scss";
import Filter from "../../components/Filter/Filter";
import Card from "../../components/Card/Card";
import VerticalCard from "../../components/VerticalCard/VerticalCard";
import Map from "../../components/Map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";

function ListPage() {
  const data = useLoaderData();
  const [toggleView, setToggleView] = useState(true);
  
  return (
    <>
        <div className="listPage">
            <div className="listContainer">
                <div>
                    <Filter />
                    <br/>
                    <div className="trigger-button" onClick={() => setToggleView(!toggleView)}>
                    {toggleView 
                    ? (
                        <i className="bi bi-list"> List View</i>
                    ) : (
                        <i className="bi bi-grid"> Grid View</i>
                    )
                    }
                    </div>
                </div>
                    <br/>
                    <br/>
                <div className="wrapper">
                {/* <Suspense fallback={<p>Loading...</p>}>
                    <Await
                    resolve={1+1 == 2}
                    errorElement={<p>Error loading posts!</p>}
                    >
                    {(postResponse) =>
                        data.map((post) => (
                            toggleView?
                            (<Card key={post.id} item={post} />)
                            :(<VerticalCard key={post.id} item={post} />)
                        
                        ))
                    }
                    </Await>
                </Suspense> */}
                <Suspense fallback={<LoadingSpinner label="Loading listings..." />}>
                    <Await
                    resolve={data.postResponse}
                    errorElement={<p>Error loading posts!</p>}
                    >
                    {(postResponse) =>
                        postResponse.data.length ? (
                          postResponse.data.map((post) =>
                            toggleView ? (
                              <Card key={post.id} item={post} />
                            ) : (
                              <VerticalCard key={post.id} item={post} />
                            )
                          )
                        ) : (
                          <EmptyState
                            title="No listings found"
                            subtitle="Try changing your filters or search criteria."
                          />
                        )
                    }
                    </Await>
                </Suspense>
                </div>
            </div>
            <div className="mapContainer">
                {/* <Suspense fallback={<p>Loading...</p>}>
                <Await
                    resolve={1+1 == 2}
                    errorElement={<p>Error loading posts!</p>}
                >
                    {(postResponse) => <Map items={data} />}
                </Await>
                </Suspense> */}
                <Suspense fallback={<LoadingSpinner label="Loading map..." />}>
                    <Await
                        resolve={data.postResponse}
                        errorElement={<p>Error loading posts!</p>}
                    >
                        {(postResponse) => <Map items={postResponse.data} />}
                    </Await>
                </Suspense>
            </div>
        </div>
    </>
  );
}

export default ListPage;
