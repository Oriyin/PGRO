import React, { useEffect, useState } from 'react';
import { Modal, Button, TextField, Box } from '@mui/material';

const EditProductModal = ({ isOpen, onRequestClose, product, onEditProduct }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setQuantity(product.quantity);
            setDescription(product.description);
            setImageUrl(product.image_url);
        } else {
            // Reset fields if no product is provided
            setName('');
            setPrice('');
            setQuantity('');
            setDescription('');
            setImageUrl('');
        }
    }, [product, isOpen]);

    const handleEditProduct = async () => {
        const updatedProduct = {
            id: product.id, // Ensure to include the product ID
            name,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            description,
            image_url: imageUrl,
        };

        await onEditProduct(updatedProduct);
        onRequestClose(); // Close modal after editing
    };

    return (
        <Modal open={isOpen} onClose={onRequestClose}>
            <Box sx={{ padding: 2, width: 400, margin: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
                <h2>Edit Product</h2>
                <TextField
                    label="Product Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Image URL"
                    fullWidth
                    margin="normal"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleEditProduct}>
                    Save Changes
                </Button>
            </Box>
        </Modal>
    );
};

export default EditProductModal;
