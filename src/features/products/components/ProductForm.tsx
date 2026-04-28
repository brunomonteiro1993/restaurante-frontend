import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ProductCategoryOption } from '@/features/products/types/products.types'

interface ProductFormFieldsProps {
  categoryOptions: ProductCategoryOption[]
  categoriesLoading: boolean
  imagePreviewUrl?: string
  onImageFileChange?: (file: File | null) => void
}

export function ProductFormFields({
  categoryOptions,
  categoriesLoading,
  imagePreviewUrl,
  onImageFileChange,
}: ProductFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Hamburguer artesanal" autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descricao</FormLabel>
            <FormControl>
              <textarea
                className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Opcional"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preco</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da imagem</FormLabel>
            <FormControl>
              <Input placeholder="https://..." autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Imagem do computador</p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onImageFileChange?.(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-muted-foreground">
          Voce pode usar URL publica (http/https) ou enviar um arquivo local.
        </p>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="Pre-visualizacao do produto"
            className="h-28 w-28 rounded-md border object-cover"
          />
        )}
      </div>

      <FormField
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <select
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                disabled={categoriesLoading}
              >
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="isAvailable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <select
                className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                value={field.value ? 'AVAILABLE' : 'UNAVAILABLE'}
                onChange={(e) => field.onChange(e.target.value === 'AVAILABLE')}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              >
                <option value="AVAILABLE">Disponivel</option>
                <option value="UNAVAILABLE">Indisponivel</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
