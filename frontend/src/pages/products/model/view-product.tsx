"use client";

import FormDialog from "@/components/customUi/dialog-box";
import { Button } from "@/components/ui/button";
import { Product } from "../columns/product-columns";

interface ViewProductProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  product: Product
}

const ViewProduct = ({ open = false, onOpenChange, product }: ViewProductProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(price);
  };

  // Define product fields for display
  const productFields = [
    { 
      label: "Product ID", 
      key: "id" as keyof Product,
      render: (value: any) => value
    },
    { 
      label: "Title", 
      key: "name" as keyof Product,
      render: (value: any) => value
    },
    { 
      label: "Description", 
      key: "description" as keyof Product,
      render: (value: any) => value,
      className: "min-h-[80px]"
    },
    { 
      label: "Category", 
      key: "category" as keyof Product,
      render: (value: any) => (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {value}
        </span>
      )
    },
    { 
      label: "Price", 
      key: "price_lkr" as keyof Product,
      render: (value: any) => (
        <span className="text-lg font-semibold text-green-600">
          {formatPrice(value)}
        </span>
      )
    }
  ];

  return (
    <FormDialog
      label="Product Details"
      title="View Product"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-6">
        {productFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{field.label}</label>
            <div className={`p-3 bg-gray-50 rounded-md border ${field.className || ''}`}>
              {field.render(product[field.key])}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </Button>
        </div>
      </div>
    </FormDialog>
  );
};

export default ViewProduct;