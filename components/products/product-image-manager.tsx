"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash, Upload, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Product, ProductImage } from "@/global-types";
import {
  addProductImage,
  deleteProductImage,
  updateProductImage,
} from "@/app/actions/products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductImageManagerProps {
  product: Product;
}

export function ProductImageManager({ product }: ProductImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const images = product.Images || [];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload to Firebase via our API route
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // 2. Add to backend
      const res = await addProductImage(product.ID, {
        url: uploadData.url,
        is_main: images.length === 0, // First image is main by default
        image_description: file.name,
      });

      if (res.success) {
        toast.success("Image added successfully");
      } else {
        toast.error(res.error || "Failed to add image to product");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading same file again
      e.target.value = "";
    }
  };

  const handleDelete = async (image: ProductImage) => {
    setLoadingId(image.ID);
    const res = await deleteProductImage(product.ID, image.ID, image.URL);
    setLoadingId(null);

    if (res.success) {
      toast.success("Image deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete image");
    }
  };

  const handleSetMain = async (image: ProductImage) => {
    if (image.IsMain) return;

    setLoadingId(image.ID);
    // Unset current main (if any)
    // Note: Backend might handle this automatically, but frontend doesn't know without a refresh.
    // The safest is to just set this one to main.

    // We are using updateProductImage to set is_main: true
    const res = await updateProductImage(product.ID, image.ID, {
      is_main: true,
    });
    setLoadingId(null);

    if (res.success) {
      toast.success("Main image updated");
    } else {
      toast.error(res.error || "Failed to update main image");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium">Product Images</h3>
        <div className="flex flex-wrap gap-4">
          {images.map((img) => (
            <div
              key={img.ID}
              className="group relative h-24 w-24 overflow-hidden rounded-md border bg-gray-100"
            >
              <Image
                src={img.URL}
                alt={img.ImageDescription || "Product image"}
                className="object-cover"
                fill
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant={img.IsMain ? "default" : "secondary"}
                  className="h-6 w-6"
                  onClick={() => handleSetMain(img)}
                  title="Set as Main"
                  disabled={loadingId === img.ID}
                >
                  <Star
                    className={`h-3 w-3 ${img.IsMain ? "fill-white" : ""}`}
                  />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      disabled={loadingId === img.ID}
                      title="Delete"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this image.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(img);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {loadingId === img.ID && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
              {img.IsMain && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}

          <div className="relative flex h-24 w-24 items-center justify-center rounded-md border border-dashed hover:bg-gray-50">
            <Label
              htmlFor="image-upload"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Add</span>
                </>
              )}
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
