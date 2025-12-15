import { createClient } from "@/lib/supabase/server";
import { createInventoryItem } from "@/lib/supabase/queries/inventory";

/**
 * Seed Inventory Data
 * 
 * This is a temporary utility route to seed dummy inventory data for testing.
 * Once you have real data, you can delete this file.
 * 
 * Usage: Make a GET request to /api/seed/inventory
 * Or visit the URL in your browser while logged in
 */

export async function GET() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Dummy inventory data
  const seedData = [
    // Items with adequate stock (green status)
    { sku: 'SKU-001', name: 'Wireless Mouse', quantity: 150, location: 'Warehouse A - Shelf 3', reorder_threshold: 20 },
    { sku: 'SKU-002', name: 'Mechanical Keyboard', quantity: 85, location: 'Warehouse A - Shelf 5', reorder_threshold: 15 },
    { sku: 'SKU-003', name: 'USB-C Cable', quantity: 200, location: 'Warehouse B - Bin 12', reorder_threshold: 30 },
    { sku: 'SKU-004', name: 'Monitor Stand', quantity: 45, location: 'Warehouse A - Shelf 7', reorder_threshold: 10 },
    { sku: 'SKU-005', name: 'Laptop Stand', quantity: 60, location: 'Warehouse B - Shelf 2', reorder_threshold: 12 },
    
    // Items with low stock (red status - quantity <= reorder_threshold)
    { sku: 'SKU-006', name: 'Gaming Headset', quantity: 8, location: 'Warehouse A - Shelf 1', reorder_threshold: 10 },
    { sku: 'SKU-007', name: 'Webcam HD', quantity: 5, location: 'Warehouse B - Shelf 4', reorder_threshold: 10 },
    { sku: 'SKU-008', name: 'USB Hub 4-Port', quantity: 12, location: 'Warehouse A - Bin 5', reorder_threshold: 15 },
    { sku: 'SKU-009', name: 'Desk Mat Large', quantity: 3, location: 'Warehouse B - Shelf 8', reorder_threshold: 5 },
    { sku: 'SKU-010', name: 'Monitor Arm Single', quantity: 2, location: 'Warehouse A - Shelf 9', reorder_threshold: 5 },
    
    // Items with location null (testing null handling)
    { sku: 'SKU-011', name: 'HDMI Cable', quantity: 75, location: null, reorder_threshold: 20 },
    { sku: 'SKU-012', name: 'Ethernet Cable', quantity: 90, location: null, reorder_threshold: 25 },
    
    // More items for variety
    { sku: 'SKU-013', name: 'LED Desk Lamp', quantity: 35, location: 'Warehouse B - Shelf 6', reorder_threshold: 8 },
    { sku: 'SKU-014', name: 'Cable Management Kit', quantity: 42, location: 'Warehouse A - Bin 8', reorder_threshold: 10 },
    { sku: 'SKU-015', name: 'Laptop Cooling Pad', quantity: 28, location: 'Warehouse B - Shelf 3', reorder_threshold: 7 },
  ];

  const results = [];
  const errors = [];

  // Insert each item
  for (const item of seedData) {
    try {
      const result = await createInventoryItem(item);
      if (result.error) {
        // Item might already exist (duplicate SKU)
        errors.push({ sku: item.sku, error: result.error });
      } else {
        results.push({ sku: item.sku, name: item.name });
      }
    } catch (error) {
      errors.push({ sku: item.sku, error: String(error) });
    }
  }

  return Response.json({
    success: true,
    message: `Seeded ${results.length} inventory items`,
    created: results,
    errors: errors.length > 0 ? errors : undefined,
    note: "You can now refresh your inventory page to see the data",
  });
}

