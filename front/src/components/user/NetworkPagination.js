import React, { useMemo } from "react";
import { Row, Col, Form, Pagination } from "react-bootstrap";

const NetworkPagination = ({ page, lastPage, setPage }) => {
  const pagination = [];
  for (let num = 1; num <= lastPage; num++) {
    pagination.push(
      <Pagination.Item
        key={num}
        active={num === page}
        onClick={() => setPage(num)}
      >
        {num}
      </Pagination.Item>
    );
  }

  return (
    <Row className="justify-content-center mt-3">
      <Col md={2} xs={5}>
        <Pagination>
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage((cur) => cur - 1)}
          />
          {pagination}
          <Pagination.Next
            disabled={page === lastPage}
            onClick={() => setPage((cur) => cur + 1)}
          />
        </Pagination>
      </Col>
    </Row>
  );
};

export default NetworkPagination;
