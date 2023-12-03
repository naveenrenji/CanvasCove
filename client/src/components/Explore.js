import React, { useState, useEffect } from "react";
import { Nav, Alert, Container } from "react-bootstrap";
import { Loader } from "./common";
import SearchBar from "./common/SearchBar";
import { userApi, artAPI } from "../api";

const Explore = () => {
    const [error, setError] = useState();
    const [list, setList] = useState([]);
    const [entity, setEntity] = useState("art");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState();
    const [currentTab, setCurrentTab] = useState("search-art");

    // Write useEffect hook to set entity on switchTab
    useEffect(() => {
        if (currentTab === "search-art") {
            setEntity("art");
        } else {
            setEntity("artist");
        }
    }
    , [currentTab]);

    const handleSearch = (searchTerm) => {
        console.log('Searching for:', searchTerm);
        setSearchTerm(searchTerm);
        if (searchTerm?.length > 2) {
            setLoading(true);
            (async () => {
                try {
                    const list = 
                        currentTab === "search-artist"
                        ? await userApi.searchApi(searchTerm)
                        : await artAPI.searchApi(searchTerm);
                    setList(list);
                    setLoading(false);
                } catch (err) {
                    setError(err?.response?.data?.error || err?.message);
                    setLoading(false);
                }
            })();
        }
    };

    const switchTab = (eventKey) => {
        setCurrentTab(eventKey);
    };

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
                            <p>List</p>
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
