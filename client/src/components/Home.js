import React from "react";
import { ArtCard, ArtCardPlaceholder, IconButton } from "./common";

import { artAPI } from "../api";
import { INTERACTION_TYPES } from "../constants";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [feed, setFeed] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const getFeed = React.useCallback(async () => {
    try {
      setLoading(true);
      const feedRes = await artAPI.getFeedApi(page);
      setFeed(feedRes);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    getFeed();
  }, [getFeed]);

  const likeClickHandler = async (art) => {
    try {
      const updatedArt = await artAPI.interactWithArtApi(
        art._id,
        INTERACTION_TYPES.LIKE
      );
      setFeed((prevFeed) => {
        const updatedFeed = prevFeed.map((art) => {
          if (art._id === updatedArt._id) {
            return updatedArt;
          }
          return art;
        });
        return updatedFeed;
      });
    } catch (error) {
      setError(error?.message);
    }
  };

  const onPageChange = async (newPage) => {
    try {
      await Promise.all(
        feed
          .map((art) =>
            !art.currentUserInteractions.length
              ? artAPI.interactWithArtApi(art._id, INTERACTION_TYPES.VIEW)
              : null
          )
          .filter((i) => !!i)
      );
      setPage(newPage);
    } catch (error) {
      setError(error?.message);
    }
  };

  const onNextClick = () => onPageChange(page + 1);
  const onPrevClick = () => onPageChange(page - 1);

  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <Container fluid="md">
          <Row xs={12} sm={12} className="g-0">
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-end"
            >
              <IconButton
                icon="arrow-left"
                onClick={onPrevClick}
                disabled={page === 1}
                title="Previous Page"
              />
            </Col>
            <Col xs={10} sm={{ span: 8, offset: 1 }}>
              {loading ? (
                <ArtCardPlaceholder />
              ) : feed.length ? (
                feed.map((art, idx) => (
                  <ArtCard art={art} onLikeClick={likeClickHandler} />
                ))
              ) : (
                <p>No art to show</p>
              )}
            </Col>
            <Col
              xs={1}
              sm={{ span: 1, offset: 1 }}
              className="d-flex align-items-center justify-content-start"
            >
              <IconButton
                icon="arrow-right"
                onClick={onNextClick}
                disabled={!feed.length}
                title="Next Page"
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Home;
