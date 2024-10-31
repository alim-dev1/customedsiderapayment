import React, { useState, useEffect } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import axios from "axios";
import Link from "next/link";

const Table = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/search`
        );
        setProducts(response.data.products);
        console.log(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Container className="mt-5">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(
              (product) =>
                product.id == id && (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>
                      <Link href="#" onClick={() => handleShowModal(product)}>
                        Payment
                      </Link>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Payment for {selectedProduct?.title}
              {selectedProduct?.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Proceed with the payment for {selectedProduct?.title}?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseModal}>
              Confirm Payment
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Table;
