# WooCommerce MCP Server

MCP server for the WooCommerce REST API. Provides tools for managing products, orders, customers, coupons, reports, shipping, and webhooks.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `WOOCOMMERCE_URL` | WooCommerce store URL (e.g. `https://store.example.com`) |
| `WOOCOMMERCE_KEY` | WooCommerce REST API consumer key |
| `WOOCOMMERCE_SECRET` | WooCommerce REST API consumer secret |

## Tools (28)

### Products (7)
- `list_products` - List products with filtering (per_page, page, search, category, status)
- `get_product` - Get a single product by ID
- `create_product` - Create a new product (name, type, regular_price, description, categories)
- `update_product` - Update an existing product
- `delete_product` - Delete a product permanently
- `list_product_categories` - List all product categories
- `create_product_category` - Create a new product category (name, parent)

### Orders (5)
- `list_orders` - List orders with filtering (status, per_page, page, after, before)
- `get_order` - Get a single order by ID
- `create_order` - Create a new order (line_items, billing, shipping)
- `update_order` - Update an order (e.g. change status)
- `delete_order` - Delete an order permanently

### Customers (3)
- `list_customers` - List customers with filtering (per_page, page, search)
- `get_customer` - Get a single customer by ID
- `create_customer` - Create a new customer (email, first_name, last_name)

### Coupons (3)
- `list_coupons` - List all coupons
- `create_coupon` - Create a new coupon (code, discount_type, amount)
- `delete_coupon` - Delete a coupon permanently

### Reports (4)
- `get_sales_report` - Get sales report for a date range
- `get_top_sellers` - Get top selling products
- `get_orders_totals` - Get orders totals grouped by status
- `get_customers_totals` - Get customers totals (paying vs non-paying)

### Shipping (3)
- `list_shipping_zones` - List all shipping zones
- `list_shipping_methods` - List methods for a specific zone
- `list_tax_rates` - List all tax rates

### Webhooks (3)
- `list_webhooks` - List all webhooks
- `create_webhook` - Create a new webhook (name, topic, delivery_url)
- `delete_webhook` - Delete a webhook permanently

## Setup

```bash
npm install
npm run build
```

## Usage

```json
{
  "mcpServers": {
    "woocommerce": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "WOOCOMMERCE_URL": "https://store.example.com",
        "WOOCOMMERCE_KEY": "ck_xxxx",
        "WOOCOMMERCE_SECRET": "cs_xxxx"
      }
    }
  }
}
```
