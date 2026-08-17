-- ODOFASHION ATOMIC STOCK + ORDER PLACEMENT
-- Run this once in Supabase SQL Editor.

create or replace function public.odo_place_order(
  p_customer_name text,
  p_customer_phone text,
  p_city text,
  p_delivery_address text,
  p_customer_note text default null,
  p_items jsonb default '[]'::jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order public.orders;
  v_order_number text;
  v_total numeric := 0;
  v_item jsonb;
  v_product public.products;
  v_qty integer;
  v_price numeric;
  v_sku text;
begin
  if v_user_id is null then
    raise exception 'Please login before placing an order.';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  v_order_number := 'ODO-' || substr(md5(random()::text || clock_timestamp()::text), 1, 8);

  -- Validate every line and lock product rows so concurrent checkouts cannot oversell.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_sku := nullif(trim(v_item->>'sku'), '');
    v_qty := greatest(1, coalesce((v_item->>'quantity')::integer, (v_item->>'qty')::integer, 1));

    select * into v_product
    from public.products
    where active = true
      and ((v_sku is not null and sku = v_sku) or (v_sku is null and lower(name) = lower(trim(v_item->>'name'))))
    for update;

    if not found then
      raise exception 'Product not found: %', coalesce(v_item->>'name', v_sku, 'unknown');
    end if;

    if coalesce(v_product.stock_quantity, 0) < v_qty then
      raise exception 'Only % item(s) left for %.', coalesce(v_product.stock_quantity, 0), v_product.name;
    end if;

    v_price := coalesce(v_product.price, 0);
    v_total := v_total + v_price * v_qty;
  end loop;

  insert into public.orders (
    user_id,
    order_number,
    customer_name,
    customer_phone,
    city,
    delivery_address,
    payment_method,
    payment_status,
    order_status,
    subtotal,
    delivery_fee,
    total,
    customer_note
  ) values (
    v_user_id,
    v_order_number,
    trim(p_customer_name),
    trim(p_customer_phone),
    trim(p_city),
    trim(p_delivery_address),
    'COD',
    'PENDING',
    'RECEIVED',
    v_total,
    0,
    v_total,
    nullif(trim(p_customer_note), '')
  ) returning * into v_order;

  -- Insert lines using the authoritative current product price, then decrement stock atomically.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_sku := nullif(trim(v_item->>'sku'), '');
    v_qty := greatest(1, coalesce((v_item->>'quantity')::integer, (v_item->>'qty')::integer, 1));

    select * into v_product
    from public.products
    where active = true
      and ((v_sku is not null and sku = v_sku) or (v_sku is null and lower(name) = lower(trim(v_item->>'name'))))
    for update;

    v_price := coalesce(v_product.price, 0);

    insert into public.order_items (
      order_id,
      product_name,
      product_sku,
      size,
      quantity,
      unit_price,
      line_total
    ) values (
      v_order.id,
      v_product.name,
      v_product.sku,
      coalesce(v_item->>'size', 'ONE SIZE'),
      v_qty,
      v_price,
      v_price * v_qty
    );

    update public.products
    set stock_quantity = coalesce(stock_quantity, 0) - v_qty,
        updated_at = now()
    where id = v_product.id;
  end loop;

  return v_order;
end;
$$;

grant execute on function public.odo_place_order(text,text,text,text,text,jsonb) to authenticated;
