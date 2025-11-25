'use client';

import { ProductSchema } from '@/schema';
import { z } from 'zod';
import { Product } from '../columns/product-columns';
import { useAddProduct, useUpdateProduct } from '../../../hooks/useProductMutations';
import { FormWrapper } from '@/components/customUi/form-wrapper';
import { FormInput } from '@/components/customUi/form-input';
import { FormSelect } from '@/components/customUi/form-select';
import { FormTextarea } from '@/components/customUi/form-textarea';

type ProductFormData = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

// Product categories
const categoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Books', label: 'Books' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Food & Beverages', label: 'Food & Beverages' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Health', label: 'Health' },
];

export default function ProductForm({
  isOpen,
  onOpenChange,
  product,
  mode,
}: ProductFormProps) {
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();

  const defaultValues = {
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price?.toString() || '',
  };

  // Prepare initialData with proper string formatting for edit mode
  const initialData = product ? {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price.toString(), // Ensure price is string for form validation
  } : undefined;

  const handleSubmit = async (data: ProductFormData) => {
    if (mode === 'create') {
      await addProductMutation.mutateAsync(data);
    } else if (mode === 'edit' && product) {
      await updateProductMutation.mutateAsync({
        id: product.productId,
        ...data,
      });
    }
    onOpenChange(false);
  };

  return (
    <FormWrapper
      open={isOpen}
      onOpenChange={onOpenChange}
      entityName="Product"
      schema={ProductSchema}
      defaultValues={defaultValues}
      initialData={initialData}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <>
          <FormInput
            control={form.control}
            name="name"
            label="Product Name"
            placeholder="Enter product name"
          />
          
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter product description"
          />
          
          <FormSelect
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
          />
          
          <FormInput
            control={form.control}
            name="price"
            label="Price (LKR)"
            type="number"
            placeholder="Enter price"
          />
        </>
      )}
    </FormWrapper>
  );
}