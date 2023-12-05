import React, { useState, useEffect } from "react";
import { 
    Nav,
    Row,
    Col,
    Alert,
    Tooltip,
    Container,
    OverlayTrigger,
} from "react-bootstrap";

import { Loader, OverlayArtCard, UserItem } from "./common";
import SearchBar from "./common/SearchBar";
import { userApi, artAPI } from "../api";
import { USER_ROLES } from "../constants";

const Explore = () => {
    const [error, setError] = useState("");
    const [list, setList] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [entity, setEntity] = useState("art");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentTab, setCurrentTab] = useState("search-art");


    // useEffect hook to set entity on switchTab
    useEffect(() => {
        setSearchTerm("");
        if (currentTab === "search-art") {
            setEntity("art");
        } else {
            setEntity("artist");
        }
        // Load all artist by default if currentTab is "search-artist"
        if (currentTab === "search-artist") {
            if (allArtists.length) {
                setList(allArtists);
            } else {
                setLoading(true);
                (async () => {
                    try {
                        const list = await userApi.searchApi({role: USER_ROLES.ARTIST});
                        setList(list);
                        setAllArtists(list);
                        setLoading(false);
                    } catch (err) {
                        setError(err?.response?.data?.error || err?.message);
                        setLoading(false);
                    }
                })();
            }
        } else {
            setList([]);
        }
    }
    , [currentTab, allArtists]);

    const handleSearch = (searchTerm) => {
        console.log('Searching for:', searchTerm);
        setSearchTerm(searchTerm);
        if (searchTerm?.length > 2) {
            setLoading(true);
            (async () => {
                try {
                    const list = 
                        currentTab === "search-artist"
                        ? await userApi.searchApi({keyword: searchTerm, role: USER_ROLES.ARTIST})
                        : await artAPI.searchApi(searchTerm);
                    setList(list);
                    setLoading(false);
                } catch (err) {
                    setError(err?.response?.data?.error || err?.message);
                    setLoading(false);
                }
            })();
        }
        if (!searchTerm.length) {
            if (currentTab === "search-artist") {
                setList(allArtists);
            } else {
                setList([]);
            }
        }
    };

    const switchTab = (eventKey) => {
        setCurrentTab(eventKey);
    };

    const handleArtChange = (art) => {
        setList((prevList) => {
            const updatedList = prevList.map((_art) => {
                if (_art._id === art._id) {
                    return art;
                }
                return _art;
            });
            return updatedList;
        });
    }

    const handleLikeClick = async (art) => {
        try {
            const updatedArt = await artAPI.interactWithArtApi(art._id, "like");
            setList((prevList) => {
                const updatedList = prevList.map((_art) => {
                    if (_art._id === updatedArt._id) {
                        return updatedArt;
                    }
                    return _art;
                });
                return updatedList;
            });
        } catch (error) {
            console.log(error?.message);
        }
    }

    return (
        <Container fluid="md">
            {loading ? <Loader /> : null}
            <Container>
                {/* Create nav tabs for 'Search Art' and 'Search Artist' */}
                <Nav variant="underline" activeKey={currentTab} onSelect={switchTab}>
                    <Nav.Item>
                        <Nav.Link eventKey="search-art">Search Art</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="search-artist">Search Artist</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            <Container style={{ marginTop: "1rem" }}>
                {/* Display a search bar to search art */}
                <SearchBar
                    onChange={handleSearch}
                    searchTerm={searchTerm}
                    placeholder={currentTab === "search-art" ? "Search with art name or description" : "Search with artist name"}
                />
                {
                    error ? (
                        <p>{error}</p>
                    ) : (
                        list.length > 0 ? (
                        <Row>
                            {list?.map((_entity) => (
                              <Col key={_entity._id} xs={12} md={6} lg={4} className="mb-4">
                                {
                                    currentTab === "search-art" ? (
                                        <OverlayArtCard
                                            art={_entity}
                                            onArtChange={handleArtChange}
                                            onLikeClick={handleLikeClick}
                                        />
                                    ) : (
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={
                                              <Tooltip id={`/users/${_entity?._id}`}>
                                                View more about {_entity?.firstName} {_entity?.lastName}
                                              </Tooltip>
                                            }
                                        >
                                            <UserItem user={_entity} />
                                        </OverlayTrigger>
                                    )
                                }
                              </Col>
                            ))}
                          </Row>
                        ) : (
                            <Alert variant="light">
                            <Alert.Heading>{searchTerm ? "Art not found!" : "No search term!"}</Alert.Heading>
                            <hr />
                            <span>
                                {searchTerm
                                ? `Sorry, we couldn't find any ${entity} matching "${searchTerm}".`
                                : `Please enter a search term to find ${entity}.`}
                            </span>
                          </Alert>
                        )   
                    )
                }
            </Container>
        </Container>
    );
};

export default Explore;
