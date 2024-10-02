import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
} from '@mui/material'; // Ensure this import is correct
import AddProductModal from './AddProductModal'; 
import EditProductModal from './EditProductModal'; 

const ProductTable = () => {
    const [products, setProducts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (newProduct) => {
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });
        fetchProducts();
    };

    const handleEditProduct = async (updatedProduct) => {
        await fetch(`/api/products/${updatedProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });
        fetchProducts();
    };

    const handleDeleteProduct = async (id) => {
        await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });
        fetchProducts();
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    return (
        <div style={{ backgroundColor: '#82CAFF', height: '100vh', padding: '20px' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ color: '#003366' }}>Product Name</TableCell>
                            <TableCell style={{ color: '#003366' }}>Description</TableCell>
                            <TableCell style={{ color: '#003366' }}>Price</TableCell>
                            <TableCell style={{ color: '#003366' }}>Quantity</TableCell>
                            <TableCell style={{ color: '#003366' }}>Image</TableCell>
                            <TableCell style={{ color: '#003366' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            style={{ maxWidth: '100px', height: 'auto', objectFit: 'contain' }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => openEditModal(product)} 
                                            style={{ marginRight: '8px' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            color="secondary" 
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => {
                        setCurrentProduct(null); 
                        setIsAddModalOpen(true);
                    }}
                    style={{ backgroundColor: '#f50057' }}
                >
                    Add Product
                </Button>
            </Box>
            <AddProductModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                onAddProduct={handleAddProduct}
            />
            <EditProductModal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                onEditProduct={handleEditProduct}
                product={currentProduct}
            />
        </div>
    );
};

export default ProductTable;
