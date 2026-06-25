import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ProductFormFields } from '@/features/products/components/ProductForm'
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct'
import { useProductCategoryOptions } from '@/features/products/hooks/useProductCategoryOptions'
import {
  createProductFormSchema,
  type CreateProductFormInput,
  type CreateProductFormValues,
} from '@/features/products/schemas/product-form.schema'

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const createMutation = useCreateProduct()
  const { data: categoryOptions = [], isLoading: categoriesLoading } = useProductCategoryOptions()
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>(undefined)
  const [selectedImageFile, setSelectedImageFile] = useState<File | undefined>(undefined)

  const form = useForm<CreateProductFormInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 1,
      imageUrl: '',
      categoryId: '',
      isAvailable: true,
    },
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({
        name: '',
        description: '',
        price: 1,
        imageUrl: '',
        categoryId: '',
        isAvailable: true,
      })
      setLocalPreviewUrl(undefined)
      setSelectedImageFile(undefined)
    }
    onOpenChange(next)
  }

  useEffect(() => {
    return () => {
      if (localPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  const typedImageUrl = form.watch('imageUrl')
  const resolvedPreviewUrl =
    localPreviewUrl ??
    (typeof typedImageUrl === 'string' && typedImageUrl.trim().length > 0
      ? typedImageUrl.trim()
      : undefined)

  const onSubmit = (values: CreateProductFormValues) => {
    const normalizedImageUrl =
      typeof values.imageUrl === 'string' && values.imageUrl.trim().length > 0
        ? values.imageUrl.trim()
        : undefined

    createMutation.mutate(
      {
        name: values.name,
        description: values.description?.trim() ? values.description.trim() : undefined,
        price: values.price,
        imageUrl: normalizedImageUrl,
        imageFile: selectedImageFile,
        categoryId: values.categoryId,
        isAvailable: values.isAvailable,
      },
      {
        onSuccess: () => handleOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Formulario alinhado ao POST /products.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ProductFormFields
              categoryOptions={categoryOptions}
              categoriesLoading={categoriesLoading}
              imagePreviewUrl={resolvedPreviewUrl}
              onImageFileChange={(file) => {
                if (localPreviewUrl?.startsWith('blob:')) {
                  URL.revokeObjectURL(localPreviewUrl)
                }
                setSelectedImageFile(file ?? undefined)
                setLocalPreviewUrl(file ? URL.createObjectURL(file) : undefined)
              }}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Salvando...' : 'Criar produto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
