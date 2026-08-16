-- ODOFASHION: ORDER CONFIRMATION STOCK MANAGEMENT
-- Run once in Supabase SQL Editor.

alter table public.orders
  add column if not exists stock_applied boolean not null default false;

alter table public.order_items
  add column if not exists product_sku text;

create index if not exists order_items_product_sku_idx
on public.order_items(product_sku);

-- Copy SKU from products for existing order items where the name matches.
update public.order_items oi
set product_sku = p.sku
from public.products p
where oi.product_sku is null
  and lower(trim(oi.product_name)) = lower(trim(p.name));

create or replace function public.admin_update_order_status(p_order_id uuid, p_new_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item record;
  v_product public.products%rowtype;
  v_delta integer;
begin
  if not public.is_odo_admin() then
    raise exception 'Admin access required';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  if p_new_status = v_order.order_status then
    return jsonb_build_object('ok', true, 'status', v_order.order_status, 'stock_applied', v_order.stock_applied);
  end if;

  -- Confirming an order reserves/decrements stock exactly once.
  if p_new_status = 'CONFIRMED' and not v_order.stock_applied then
    for v_item in
      select * from public.order_items where order_id = v_order.id
    loop
      v_product := null;

      if v_item.product_sku is not null then
        select * into v_product
        from public.products
        where sku = v_item.product_sku
        for update;
      end if;

      if v_product.id is null then
        select * into v_product
        from public.products
        where lower(trim(name)) = lower(trim(v_item.product_name))
        limit 1
        for update;
      end if;

      if v_product.id is null then
        raise exception 'Product not found for order item: %', v_item.product_name;
      end if;

      if v_product.stock_quantity < v_item.quantity then
        raise exception 'Insufficient stock for % (available %, requested %)',
          v_product.name, v_product.stock_quantity, v_item.quantity;
      end if;

      update public.products
      set stock_quantity = stock_quantity - v_item.quantity,
          sold_count = coalesce(sold_count, 0) + v_item.quantity,
          updated_at = now()
      where id = v_product.id;
    end loop;

    update public.orders
    set order_status = p_new_status,
        stock_applied = true
    where id = v_order.id;

  -- Cancelling a confirmed order returns the reserved stock.
  elsif p_new_status = 'CANCELLED' and v_order.stock_applied then
    for v_item in
      select * from public.order_items where order_id = v_order.id
    loop
      select * into v_product
      from public.products
      where sku = v_item.product_sku
      limit 1
      for update;

      if v_product.id is null then
        select * into v_product
        from public.products
        where lower(trim(name)) = lower(trim(v_item.product_name))
        limit 1
        for update;
      end if;

      if v_product.id is not null then
        update public.products
        set stock_quantity = stock_quantity + v_item.quantity,
            sold_count = greatest(0, coalesce(sold_count, 0) - v_item.quantity),
            updated_at = now()
        where id = v_product.id;
      end if;
    end loop;

    update public.orders
    set order_status = p_new_status,
        stock_applied = false
    where id = v_order.id;
  else
    update public.orders
    set order_status = p_new_status
    where id = v_order.id;
  end if;

  return jsonb_build_object('ok', true, 'status', p_new_status);
end;
$$;

grant execute on function public.admin_update_order_status(uuid, text)
to authenticated;
