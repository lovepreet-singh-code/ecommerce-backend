import { hash } from "bcryptjs";

export async function up(db) {
  // Step 1: Add role field
  await db.collection("users").updateMany(
    { role: { $exists: false } },
    { $set: { role: "user" } }
  );

  // Hash admin & vendor passwords
  const adminPassword = await hash("admin123", 10);
  const vendorPassword = await hash("vendor123", 10);

  // Step 2: Create default admin if not exists
  await db.collection("users").updateOne(
    { email: "admin@shop.com" },
    {
      $setOnInsert: {
        name: "Admin",
        email: "admin@shop.com",
        password: adminPassword, // ✅ bcrypt hash
        role: "admin",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  // Step 3: Create default vendor if not exists
  await db.collection("users").updateOne(
    { email: "vendor@shop.com" },
    {
      $setOnInsert: {
        name: "Vendor",
        email: "vendor@shop.com",
        password: vendorPassword, // ✅ bcrypt hash
        role: "vendor",
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}
export async function down(db) {
  await db.collection("users").updateMany({}, { $unset: { role: "" } });
  await db.collection("users").deleteOne({ email: "admin@shop.com" });
  await db.collection("users").deleteOne({ email: "vendor@shop.com" });
}
