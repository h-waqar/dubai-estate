"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  createEntitlementDefinitionAction, 
  updateEntitlementDefinitionAction, 
  deleteEntitlementDefinitionAction 
} from "../actions/entitlement.actions";
import { entitlementDefinitionSchema, EntitlementDefinitionInput } from "@/validators/entitlement";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface EntitlementDefinition {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export default function EntitlementAdminList({
  initialDefinitions,
}: {
  initialDefinitions: EntitlementDefinition[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<EntitlementDefinition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<EntitlementDefinitionInput>({
    resolver: zodResolver(entitlementDefinitionSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const handleDialogOpen = (definition: EntitlementDefinition | null = null) => {
    setEditingDefinition(definition);
    if (definition) {
      form.reset({
        name: definition.name,
        code: definition.code,
        description: definition.description || "",
      });
    } else {
      form.reset({ name: "", code: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: EntitlementDefinitionInput) => {
    setIsSubmitting(true);
    try {
      let result;
      if (editingDefinition) {
        result = await updateEntitlementDefinitionAction(editingDefinition.id, values);
      } else {
        result = await createEntitlementDefinitionAction(values);
      }

      if (result.success) {
        toast.success(editingDefinition ? "Entitlement updated successfully." : "Entitlement created successfully.");
        setIsDialogOpen(false);
        router.refresh();
      } else {
        if (typeof result.error === 'string') {
          toast.error(result.error);
        } else {
          toast.error("Validation error. Please check your inputs.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the entitlement.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entitlement definition? This may break existing plans and grants.")) {
      try {
        const result = await deleteEntitlementDefinitionAction(id);
        if (result.success) {
          toast.success("Entitlement deleted successfully.");
          router.refresh();
        } else {
          toast.error(result.error as string || "Failed to delete entitlement.");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the entitlement.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Entitlement Definitions</h2>
        <Button onClick={() => handleDialogOpen()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Definition
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialDefinitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No entitlement definitions found.
                </TableCell>
              </TableRow>
            ) : (
              initialDefinitions.map((def) => (
                <TableRow key={def.id}>
                  <TableCell className="font-medium">{def.name}</TableCell>
                  <TableCell>
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">
                      {def.code}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{def.description || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDialogOpen(def)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(def.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDefinition ? "Edit Entitlement" : "Create Entitlement"}
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
                      <Input placeholder="e.g., Property Slots" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., PROPERTY_SLOT" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what this entitlement allows..." 
                        className="resize-none"
                        {...field} 
                      />
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
                    : editingDefinition
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
