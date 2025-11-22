"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  createFeature,
  updateFeature,
  deleteFeature,
  listFeatures,
} from "@/modules/property/actions/feature";
import { CreateFeatureValidator } from "@/modules/property/validators/feature.validator";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Trash, Edit } from "lucide-react";

interface Feature {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

type FeatureFormValues = z.infer<typeof CreateFeatureValidator>;

export default function FeatureClient({
  initialFeatures,
}: {
  initialFeatures: Feature[];
}) {
  const [features, setFeatures] = useState(initialFeatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(CreateFeatureValidator),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const fetchFeatures = async () => {
    const updatedFeatures = await listFeatures();
    setFeatures(updatedFeatures);
  };

  const handleDialogOpen = (feature: Feature | null = null) => {
    setEditingFeature(feature);
    if (feature) {
      form.reset({
        name: feature.name,
        category: feature.category || "",
      });
    } else {
      form.reset({ name: "", category: "" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: FeatureFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingFeature) {
        await updateFeature(editingFeature.id, values);
        toast.success("Feature updated successfully.");
      } else {
        await createFeature(values);
        toast.success("Feature created successfully.");
      }
      await fetchFeatures();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("An error occurred while saving the feature.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      try {
        await deleteFeature(id);
        toast.success("Feature deleted successfully.");
        await fetchFeatures();
      } catch (error) {
        toast.error("An error occurred while deleting the feature.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleDialogOpen()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell>{feature.slug}</TableCell>
              <TableCell>{feature.category || "N/A"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDialogOpen(feature)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(feature.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? "Edit Feature" : "Create Feature"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Swimming Pool" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Outdoor Amenities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingFeature
                    ? "Save Changes"
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
