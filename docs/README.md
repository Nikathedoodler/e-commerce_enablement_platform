# Documentation Index

Welcome to the E-Commerce Enablement Platform documentation.

## 📚 User Guides

Step-by-step guides for using the platform:

- [Getting Started](./user-guides/getting-started.md) - Account setup and first steps
- [Managing Orders](./user-guides/managing-orders.md) - Create, view, and fulfill orders
- [Inventory Management](./user-guides/inventory-management.md) - Track products and stock levels
- [Receiving Workflow](./user-guides/receiving-workflow.md) - Log incoming inventory
- [Shipping Labels](./user-guides/shipping-labels.md) - Generate and manage shipping labels
- [Shipping Settings](./user-guides/shipping-settings.md) - Configure automatic label generation
- [Shopify Integration](./user-guides/shopify-integration.md) - Connect and sync Shopify stores

## 🔧 Technical Documentation

Technical references for developers and operations:

- [API Reference](./technical/api-reference.md) - API endpoints and webhooks
- [Environment Variables](./technical/environment-variables.md) - Required configuration
- [Deployment Guide](./technical/deployment.md) - Production deployment instructions

## 📋 Planning & Progress

Project planning and progress tracking:

- [Technical Plan](./technical-plan.md) - Overall technical architecture and roadmap
- [Progress Summary](./progress-summary.md) - Current implementation status
- [DHL API Research](./dhl-api-research.md) - DHL integration research and setup
- [Shipping Label Flow](./shipping-label-flow.md) - Label generation workflow

## 🗄️ Database

Database migrations and schema:

- [Migrations](./migrations/) - All database migration files
  - `001_create_profiles_table.sql`
  - `002_add_full_name_to_profiles.sql`
  - `003_update_trigger_read_metadata.sql`
  - `004_sync_existing_users_profiles.sql`
  - `005_create_orders_table.sql`
  - `006_create_inventory_table.sql`
  - `007_seed_inventory_data.sql`
  - `008_create_receiving_log_table.sql`
  - `009_create_shopify_stores_table.sql`
  - `010_create_subscriptions_table.sql`
  - `011_create_shipping_labels_table.sql`
  - `012_create_chat_messages_table.sql`
  - `013_add_shipping_settings_to_profiles.sql`
  - `014_create_label_generation_audit_log.sql`

## 📖 Quick Links

### For Users
- Start here: [Getting Started Guide](./user-guides/getting-started.md)
- Need help? Check the troubleshooting sections in each guide

### For Developers
- API: [API Reference](./technical/api-reference.md)
- Setup: [Environment Variables](./technical/environment-variables.md)
- Deploy: [Deployment Guide](./technical/deployment.md)

### For Operations
- Deploy: [Deployment Guide](./technical/deployment.md)
- Monitor: Check error logs and analytics dashboards

---

**Last Updated**: 2025-01-XX

