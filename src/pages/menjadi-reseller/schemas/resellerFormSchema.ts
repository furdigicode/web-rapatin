
import { z } from 'zod';

export const resellerFormSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  whatsapp: z.string().min(10, { message: 'Nomor WhatsApp tidak valid' }),
  has_sold_zoom: z.enum(['true', 'false']),
  selling_experience: z.string().optional(),
  reason: z.string().min(10, { message: 'Alasan harus diisi minimal 10 karakter' }),
  selling_plan: z.string().min(10, { message: 'Rencana penjualan harus diisi minimal 10 karakter' }),
  monthly_target: z.coerce.number()
    .min(0, { message: 'Target harus berupa angka positif' })
    .default(0),
});

export type ResellerFormValues = z.infer<typeof resellerFormSchema>;
