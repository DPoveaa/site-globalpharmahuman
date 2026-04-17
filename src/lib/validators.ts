import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
});

export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99)
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  details: z.string().optional(),
  price: z.number().positive(),
  sku: z.string().min(3),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().cuid(),
  promotionId: z.string().cuid().optional().or(z.literal("")),
  active: z.boolean().optional()
});

export const promotionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  active: z.boolean().default(true)
});

