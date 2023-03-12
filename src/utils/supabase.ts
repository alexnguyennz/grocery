/*** SUPABASE ***/
import { type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

/*** GENERAL TYPES ***/
export type Products = Database['public']['Tables']['products']['Row'];

// include types from cart

type Price = {
  salePrice: number;
};

export type Cart = Products & {
  cart_quantity: number;
  price: Price;
};

export type CartTwo = {
  cart_quantity: number;
  price: Price;
  sku: number;
};

export type UserAddresses =
  Database['public']['Tables']['user_addresses']['Row'];

type Shelf = Database['public']['Tables']['shelf']['Row'];
type Aisle = Database['public']['Tables']['aisle']['Row'];

export type User = Database['public']['Tables']['users']['Row'] & {
  selected_user_address: UserAddresses;
};
export type Department = Database['public']['Tables']['department']['Row'];

/*** /shop/browse/department/ ***/
export async function getDepartmentAisles(
  supabase: SupabaseClient,
  departmentSlug: string | string[] | undefined
) {
  return await supabase
    .from('aisle')
    .select('*, department!inner(name), products(count)')
    .eq('department.slug', departmentSlug);
}

export type DepartmentAisles = Awaited<
  ReturnType<typeof getDepartmentAisles>
>['data'];

/*** /shop/browse/department/aisle/ ***/
export async function getAisleShelves(
  supabase: SupabaseClient,
  aisleSlug: string | string[] | undefined
) {
  return await supabase
    .from('shelf')
    .select('*, aisle!inner(*, department(*)), products(count)')
    .eq('aisle.slug', aisleSlug);
}

export type AisleShelves = Awaited<ReturnType<typeof getAisleShelves>>['data'];

/*** /shop/browse/department/aisle/shelf ***/
export async function getShelfCategories(
  supabase: SupabaseClient,
  shelfSlug: string | string[] | undefined,
  aisleSlug: string | string[] | undefined,
  departmentSlug: string | string[] | undefined
) {
  return await supabase
    .from('shelf')
    .select('*, aisle!inner(*, department(*))')
    .eq('slug', shelfSlug)
    .eq('aisle.slug', aisleSlug)
    .eq('aisle.department.slug', departmentSlug)
    .single();
}

export type ShelfCategories = Awaited<
  ReturnType<typeof getShelfCategories>
>['data'];

export async function insertUser(
  supabase: SupabaseClient,
  id: string | undefined,
  firstName: string,
  lastName: string,
  email: string | undefined,
  phoneNumber: string,
  dateOfBirth: Date | null
) {
  return await supabase
    .from('users')
    .insert({
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      date_of_birth: dateOfBirth,
      newsletter: false,
    })
    .select();
}

export type InsertUser = Awaited<ReturnType<typeof getShelfCategories>>['data'];

/*** /checkout/revieworder, /account/delivery-addresses ***/
export async function getUserAddresses(supabase: SupabaseClient) {
  return await supabase.from('user_addresses').select();
}

export type GetUserAddresses = Awaited<
  ReturnType<typeof getUserAddresses>
>['data'];

/*** /checkout/revieworder, /checkout/payment ***/
export async function getSelectedAddress(
  supabase: SupabaseClient,
  user_id: string | undefined
) {
  return await supabase
    .from('users')
    .select('*, selected_user_address(*)')
    .eq('id', user_id)
    .single();
}

/*** /account/delivery-addresses ***/
export async function getUser(
  supabase: SupabaseClient,
  user_id: string | undefined
) {
  return await supabase.from('users').select().eq('id', user_id).single();
}

/*** To cleanup ***/
/*** /shop/product/ ***/
export async function getProduct(
  supabase: SupabaseClient,
  stockcode: string | string[] | undefined
) {
  return await supabase
    .from('products')
    .select('*, shelf(*, aisle(*, department(*)))')
    .eq('sku', stockcode)
    .single();
}

export type ProductDetails = Awaited<ReturnType<typeof getProduct>>['data'] & {
  shelf: Shelf[];
  aisle: Aisle[];
  department: Department[];
};

export async function getProductImages(
  supabase: SupabaseClient,
  sku: string | undefined
) {
  return await supabase.storage.from('product').list(sku);
}

export type Storage = Awaited<ReturnType<typeof getProductImages>>['data'];
