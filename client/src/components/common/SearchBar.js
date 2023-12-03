import React from 'react';
import { Form, FormControl } from 'react-bootstrap';

const SearchBar = ({ onChange, placeholder, searchTerm }) => {

  return (
    <Form style={{ padding: "1.5rem 0" }}>
      <FormControl
        type="text"
        placeholder={placeholder || "Search"}
        className="mr-sm-2"
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
