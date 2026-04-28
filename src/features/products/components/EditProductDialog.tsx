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
import { Skeleton } from '@/components/ui/skeleton'
import { ProductFormFields } from '@/features/products/components/ProductForm'
import { useProductCategoryOptions } from '@/features/products/hooks/useProductCategoryOptions'
import { useProductDetails } from '@/features/products/hooks/useProductDetails'
import { useUpdateProduct } from '@/features/products/hooks/useUpdateProduct'
import {
  updateProductFormSchema,
  type UpdateProductFormInput,
  type UpdateProductFormValues,
} from '@/features/products/schemas/product-form.schema'

interface EditProductDialogProps {
  productId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductDialog({ productId, open, onOpenChange }: EditProductDialogProps) {
  const { data, isLoading, isError, refetch } = useProductDetails(productId, open)
  const { data: categoryOptions = [], isLoading: categoriesLoading } = useProductCategoryOptions()
  const updateMutation = useUpdateProduct()
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | undefined>(undefined)
  const [selectedImageFile, setSelectedImageFile] = useState<File | undefined>(undefined)

  const form = useForm<UpdateProductFormInput, unknown, UpdateProductFormValues>({
    resolver: zodResolver(updateProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 1,
      imageUrl: '',
      categoryId: '',
      isAvailable: true,
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      name: data.name,
      description: data.description ?? '',
      price: data.price,
      imageUrl: data.imageUrl ?? '',
      categoryId: data.categoryId,
      isAvailable: data.isAvailable,
    })
  }, [data, form])

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

  const onSubmit = (values: UpdateProductFormValues) => {
    if (!productId) return
    const normalizedImageUrl =
      typeof values.imageUrl === 'string' && values.imageUrl.trim().length > 0
        ? values.imageUrl.trim()
        : null

    updateMutation.mutate(
      {
        id: productId,
        payload: {
          name: values.name,
          description: values.description?.trim() ? values.description.trim() : null,
          price: values.price,
          imageUrl: normalizedImageUrl,
          imageFile: selectedImageFile,
          categoryId: values.categoryId,
          isAvailable: values.isAvailable,
        },
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
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>
            Dados carregados de GET /products/:id.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Nao foi possivel carregar o produto.{' '}
            <Button type="button" variant="link" className="h-auto p-0" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </p>
        )}

        {data && (
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
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
