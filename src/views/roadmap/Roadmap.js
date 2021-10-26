import React, { useState, useEffect } from "react";
import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import { HollowDotsSpinner } from "react-epic-spinners";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(true);
  const [loading, setLoading] = useState(true);

  /*
  const getRoadmap = async () => {
    await fetch(
      `https://api-beta.gitbook.com/v1/spaces/${process.env.REACT_APP_GITBOOK_SPACE}/content/v/master/id/${process.env.REACT_APP_GITBOOK_PAGE}`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + process.env.REACT_APP_GITBOOK_TOKEN,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let nodes = data["document"]["document"]["nodes"];
        let blocks = 0;
        nodes.map((n) => {
          n.type === "heading-1" && blocks++;
          n.block = blocks;
        });

        setRoadmap(nodes);
        setLoading(false);
      });
  };

  useEffect(() => {
    getRoadmap();
  }, []);
*/
  /*
  return (
    <div
      id="roadmap"
      style={{ gridTemplateRows: `repeat(${roadmap.length}, 32px)` }}
    >
      {!loading ? (
        roadmap.map((r) => {
          return r.type === "heading-1" ? (
            <div className={`text-warning heading block-${r.block}`}>
              {r.nodes[0].ranges[0].text}
            </div>
          ) : (
            <div
              className={
                r.nodes[0].ranges[0].text === "✔️ " ||
                r.nodes[0].ranges[0].text === "✔️"
                  ? `small done block-${r.block}`
                  : `small block-${r.block}`
              }
            >
              {r.nodes[0].ranges[1].text}
            </div>
          );
        })
      ) : (
        <CContainer className="w-100">
          <HollowDotsSpinner color="#00f792" className="m-auto pt-3 pb-3" />
        </CContainer>
      )}
    </div>
  );*/

  return (
    <div id="roadmap-div">
      <img src="/roadmap_v.jpg"></img>
    </div>
  );
};

export default Roadmap;
